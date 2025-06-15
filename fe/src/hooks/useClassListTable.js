import { useState, useEffect } from 'react';
import { getClassListByNameAndYear, removeStudentFromClass, addStudentToClass, getStudentsOfClass, createClassList} from '../services/classListService';
import { toast } from 'react-toastify';
import useModal from './useModal';
import { getAllParameters } from '../services/paramenterService';

import useDebounce from './useDebounce'; //Tránh fetch liên tục
import { useCallback } from "react";

const useClassListTable = (selectedYear, selectedClass, setParentStudentCount) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [classListId, setClassListId] = useState(null);
    //Search
    const [searchTerm, setSearchTerm] = useState('');
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 10, // Số học sinh mỗi trang
    });        
    //Sort 
    const [sortField, setSortField] = useState('HoTen');
    const [sortOrder, setSortOrder] = useState('asc');
      
    const studentListModal = useModal();
    // Sử dụng debounce cho searchTerm để tối ưu
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Xóa học sinh khỏi danh sách lớp
    const deleteModal = useModal();
    const [dataModal, setDataModal] = useState(null);

    //New state cho sỉ số của lớp
    const [maxClassSize, setMaxClassSize] = useState(null);
    useEffect(() => {
        const fetchSystemParameters = async () => {
            try {
                const response = await getAllParameters();
                if (response.data && response.data.EC === 0) {
                    const params = response.data.DT;
                    const siSoToiDaParam = params.find(p => p.TenThamSo === 'SiSoToiDa');
                    if (siSoToiDaParam) {
                        setMaxClassSize(parseInt(siSoToiDaParam.GiaTri, 10));
                    } else {
                        toast.error("Không tìm thấy quy định về Sĩ số tối đa trong hệ thống.");
                        setMaxClassSize(40); // Đặt một giá trị mặc định an toàn
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải quy định hệ thống:", error);
                toast.error("Không thể tải quy định về sĩ số.");
                setMaxClassSize(40); // Đặt một giá trị mặc định an toàn khi có lỗi
            }
        };
        fetchSystemParameters();
    }, []); 

    //Lấy ID của danh sách lớp trước
    useEffect(() => {
        const fetchClassListId = async () => {
            if(!selectedYear || !selectedClass) {
                setClassListId(null);
                setStudents([]);
                setPagination(prev => ({ ...prev, totalItems: 0, totalPages: 1, currentPage: 1 }));
                if (setParentStudentCount) setParentStudentCount(0);
                return;
            }
            try {
                const response = await getClassListByNameAndYear(selectedClass, selectedYear);
                //1. Trường hợp API thành công và có dữ liệu
                if (response.data && response.data.EC === 0 && response.data.DT.length > 0) {
                    const classData = response.data.DT[0];
                    setClassListId(classData.MaDanhSachLop);
                    // Cập nhật sỉ số từ lần gọi đầu tiên
                    if(setParentStudentCount){
                        setParentStudentCount(classData.SiSo || 0);
                    }
                } else if(response.data && response.data.EC ===1 && response.data.DT.length === 0) {
                    toast.info("Không có học sinh nào trong danh sách lớp này");
                    setClassListId(null);
                    setStudents([]);
                    setParentStudentCount(0);

                } else{
                    toast.error(response.data?.EM || "Lỗi khi tải danh sách lớp");
                    setClassListId(null);
                }
            }catch(e) {
                if (e.response && e.response.status === 404) {
                    toast.warn(`Danh sách lớp ${selectedClass} cho năm học ${selectedYear} chưa được tạo.`);
                } else {
                    const errorMessage = e.response?.data?.EM || e.message || 'Lỗi kết nối đến máy chủ';
                    toast.error(errorMessage);
                }
                setClassListId(null); // Luôn reset khi có lỗi
            }
        };
        fetchClassListId();
    }, [selectedClass, selectedYear]);

    // Dùng useCallback để tối ưu, tránh tạo lại hàm mỗi lần render
    const fetchStudents = useCallback(async () => {
    // Nếu không có classListId, reset state và dừng lại.
    // useEffect bên trên đã xử lý toast cho trường hợp này rồi.
    if (!classListId) {
        setStudents([]);
        setPagination(prev => ({ ...prev, totalItems: 0, totalPages: 1, currentPage: 1 }));
        if (setParentStudentCount) setParentStudentCount(0);
        return;
    }

    setLoading(true);
    try {
        const options = {
            page: pagination.currentPage,
            limit: pagination.limit,
            search: debouncedSearchTerm,
            sortField,
            sortOrder
        };
        const response = await getStudentsOfClass(classListId, options);

        // Trường hợp API trả về thành công (EC === 0)
        if (response.data && response.data.EC === 0) {
            const data = response.data.DT;
            setStudents(data.students || []);
            setPagination({
                totalItems: data.totalItems,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                limit: data.limit || 10,
            });
            // Cập nhật sỉ số ở component cha
            if (setParentStudentCount) {
                setParentStudentCount(data.totalItems);
            }
            // Chỉ hiện toast khi tìm kiếm mà không thấy, hoặc khi danh sách hoàn toàn rỗng.
            if (data.totalItems === 0) {
                // Nếu đang tìm kiếm thì thông báo khác đi
                if(debouncedSearchTerm) {
                    toast.info(`Không tìm thấy học sinh nào với từ khóa "${debouncedSearchTerm}"`);
                } else {
                    toast.info('Không có học sinh nào trong danh sách lớp này');
                }
            }
        } 
        // Trường hợp API trả về mã lỗi cụ thể cho trường hợp "rỗng" (EC === 1)
        // Coi đây là một trường hợp "thành công" nhưng không có dữ liệu
        else if (response.data && response.data.EC === 1) {
            setStudents([]); 
            setPagination(prev => ({ ...prev, totalItems: 0, totalPages: 1, currentPage: 1 }));
            if (setParentStudentCount) {
                setParentStudentCount(0);
            }
            // Tái sử dụng logic toast ở trên, không cần toast thêm ở đây nữa.
            // Chỉ cần đảm bảo message từ API được hiển thị nếu có.
            const message = response.data.EM || 'Không có học sinh nào trong danh sách lớp này';
            toast.info(message);
        }
        // Các lỗi thực sự khác
        else {  
            toast.error(response.data?.EM || 'Không thể tải danh sách học sinh');
            // Khi có lỗi, cũng reset state
            setStudents([]);
            setPagination(prev => ({ ...prev, totalItems: 0, totalPages: 1, currentPage: 1 }));
            if (setParentStudentCount) setParentStudentCount(0);
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        const errorMessage = error.response?.data?.EM || 'Lỗi kết nối máy chủ khi tải học sinh.';
        toast.error(errorMessage);
        setStudents([]); 
        setPagination(prev => ({ ...prev, totalItems: 0, totalPages: 1, currentPage: 1 }));
        if (setParentStudentCount) setParentStudentCount(0);
    } finally {
        setLoading(false);
    }
    // Chú ý đến mảng dependencies của useCallback
}, [classListId, pagination.currentPage, pagination.limit, debouncedSearchTerm, sortField, sortOrder, setParentStudentCount]);

    // useEffect ĐỂ GỌI API KHI CÁC THAM SỐ THAY ĐỔI 
     useEffect(() => {
        // Mỗi khi người dùng tìm kiếm, reset về trang 1
        setPagination(p => ({...p, currentPage: 1}));
    }, [debouncedSearchTerm]);

     useEffect(() => {
        fetchStudents();
    }, [fetchStudents]); // fetchStudents giờ đã được bọc trong useCallback

   const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
};

const handleRemoveStudent = (maCT_DSL) => {
  setDataModal(maCT_DSL);     
  deleteModal.open();
};
    const confirmRemoveStudent = async (maCT_DSL) => {
        try {
            const response = await removeStudentFromClass(maCT_DSL);
            if (response.data && response.data.EC === 0) {
                toast.success(response.data.EM || 'Xóa học sinh thành công');
            } else {
                toast.error(response.data?.EM || 'Không thể xóa học sinh');
            }
            fetchStudents();
        } catch (error) {
            console.log(error);
            console.error('Error removing student:', error);
            toast.error('Lỗi kết nối máy chủ');
        } finally {
            deleteModal.close();
        }
    };


const handleAddStudents = async (selectedStudentIds) => {
    if (!selectedStudentIds || selectedStudentIds.length === 0) {
        toast.error('Không có học sinh nào được chọn');
        return;
    }
    // --- KIỂM TRA SĨ SỐ Ở FRONTEND ---
        if (maxClassSize === null) {
            toast.warn("Đang tải quy định sĩ số, vui lòng thử lại sau giây lát.");
            return;
        }

        const currentSize = pagination.totalItems;
        const studentsToAddCount = selectedStudentIds.length;

        if (currentSize + studentsToAddCount > maxClassSize) {
            toast.error(`Không thể thêm! Lớp sẽ vượt sĩ số tối đa (${maxClassSize}).` +
                        `\nLớp hiện có: ${currentSize} học sinh.` +
                        `\nBạn đang muốn thêm: ${studentsToAddCount} học sinh.`);
            return; // Dừng lại ngay lập tức
        }
        // --- KẾT THÚC KIỂM TRA ---
    let currentClassListId = classListId;
    if(!currentClassListId){
        try{
            toast.info('Danh sách lớp chưa được tạo. Đang tiến hành tạo danh sách lớp mới.....');
            const response = await createClassList({TenLop: selectedClass, TenNamHoc: selectedYear});
            if (response.data && response.data.EC === 0) {
                currentClassListId = response.data.DT.MaDanhSachLop;
                toast.success("Tạo danh sách lớp thành công");
                setClassListId(currentClassListId);
            }else{
                toast.error(response.data?.EM || "Lỗi khi tạo danh sách lớp");
            }
        }catch(error){
           toast.error("Lỗi khi tạo danh sách lớp.");
            console.error(error);
            return; // Dừng hàm

        }
    }
    if(!currentClassListId) {
        toast.error("Không xác định được danh sách lớp để thêm học sinh.");
        return;
    }

    try {
        // Track successful and failed adds
        let successCount = 0;
        let failMessages = [];

        
        // Process each student add request sequentially
       const addPromises = selectedStudentIds.map(studentId =>
            addStudentToClass({
                MaDanhSachLop: currentClassListId,
                MaHocSinh: studentId
            }).catch(err => ({ error: err })) // Bắt lỗi của từng request
        );

        const results = await Promise.all(addPromises);

        results.forEach(res => {
            if (res && res.data && res.data.EC === 0) {
                successCount++;
            } else {
                // Gom các thông báo lỗi lại
                const errorMessage = res.data?.EM || res.error?.response?.data?.EM || "Lỗi không xác định";
                if (!failMessages.includes(errorMessage)) {
                    failMessages.push(errorMessage);
                }
            }
        });
        // Show a single toast with the results
        if (successCount > 0) {
            toast.success(`Đã thêm ${successCount} học sinh vào lớp`);
        }
        if (failMessages.length > 0) {
            failMessages.forEach(msg => toast.error(msg));
        }

        // Đóng modal và tải lại danh sách
        studentListModal.close();
        fetchStudents();
    } catch (error) {
        console.error('Error adding students:', error);
        toast.error('Lỗi khi thêm học sinh vào lớp');
    }
};

    // Filter students based on search term
    // const filteredStudents = students.filter(student => 
    //     student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     student.email.toLowerCase().includes(searchTerm.toLowerCase())
    // );

 const handlePageChange = async (event) => {
    const page = event.selected + 1;
    setPagination(prev => ({ ...prev, currentPage: page }));
    // await fetchStudents();
 }

   const handleSortChange = (field) => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    if (field === sortField) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

    return {
        students: students,
        loading,
        searchTerm,
        studentListModal,
        pagination,
        currentPage,
        deleteModal,
        dataModal,
        handleSearchChange,
        confirmRemoveStudent,
        handleAddStudents,
        handleRemoveStudent,
        handlePageChange,
        handleSortChange,
        fetchStudents,
        classListId,
        maxClassSize,
        

    };
};

export default useClassListTable;