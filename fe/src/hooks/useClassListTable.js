import { useState, useEffect } from 'react';
import { getClassListByNameAndYear, removeStudentFromClass, addStudentToClass } from '../services/classListService';
import { toast } from 'react-toastify';
import useModal from './useModal';

const useClassListTable = (selectedYear, selectedClass, setParentStudentCount) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [classListId, setClassListId] = useState(null);
    const studentListModal = useModal();

    useEffect(() => {
        if (selectedYear && selectedClass) {
            fetchStudents();
        }
    }, [selectedYear, selectedClass]);

    const fetchStudents = async () => {
        if (!selectedYear || !selectedClass) return;
        
        setLoading(true);
        try {
            console.log(`Fetching students for ${selectedClass} - ${selectedYear}`);
            const response = await getClassListByNameAndYear(selectedClass, selectedYear);
            
            if (response.data && response.data.EC === 0) {
                const classLists = response.data.DT || [];
                
                if (classLists.length > 0) {
                    const classData = classLists[0];
                    setClassListId(classData.MaDanhSachLop);
                    
                    // Get the students from the ct_dsls relation
                    const studentsList = classData.ct_dsls || [];
                    console.log('Student list:', studentsList);
                    
                    // Map to the format needed for the table
                    const formattedStudents = studentsList.map(item => ({
                        id: item.MaCT_DSL,
                        name: item.hocsinh?.HoTen || '',
                        gender: item.hocsinh?.GioiTinh || '',
                        birthYear: item.hocsinh?.NgaySinh ? new Date(item.hocsinh.NgaySinh).toLocaleDateString() : '',
                        address: item.hocsinh?.DiaChi || '',
                        email: item.hocsinh?.Email || ''
                    }));
                    
                    console.log('Formatted students:', formattedStudents);
                    setStudents(formattedStudents);
                    
                    // Update the student count in the parent component
                    if (setParentStudentCount) {
                        setParentStudentCount(formattedStudents.length);
                    }
                } else {
                    setStudents([]);
                    if (setParentStudentCount) setParentStudentCount(0);
                    console.log('No class lists found for the selected year and class');
                }
            } else {
                console.error('Error response:', response.data);
                toast.error(response.data?.EM || 'Không thể tải danh sách học sinh');
                setStudents([]);
                if (setParentStudentCount) setParentStudentCount(0);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Lỗi kết nối máy chủ');
            setStudents([]);
            if (setParentStudentCount) setParentStudentCount(0);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRemoveStudent = async (studentId) => {
        try {
            const response = await removeStudentFromClass(studentId);
            if (response.data && response.data.EC === 0) {
                toast.success(response.data.EM || 'Xóa học sinh thành công');
                fetchStudents();
            } else {
                toast.error(response.data?.EM || 'Không thể xóa học sinh');
            }
        } catch (error) {
            console.error('Error removing student:', error);
            toast.error('Lỗi kết nối máy chủ');
        }
    };

const handleAddStudents = async (selectedStudentIds) => {
    if (!classListId || !selectedStudentIds || selectedStudentIds.length === 0) {
        toast.error('Không có học sinh nào được chọn');
        return;
    }

    try {
        // Track successful and failed adds
        let successCount = 0;
        let existingCount = 0;
        
        // Process each student add request sequentially
        for (const studentId of selectedStudentIds) {
            try {
                const response = await addStudentToClass({ 
                    MaDanhSachLop: classListId, 
                    MaHocSinh: studentId 
                });
                
                if (response.data && response.data.EC === 0) {
                    successCount++;
                }
            } catch (error) {
                if (error.response?.data?.EM?.includes('đã tồn tại trong lớp')) {
                    existingCount++;
                } else {
                    throw error; // Re-throw other errors
                }
            }
        }
        
        // Show a single toast with the results
        if (successCount > 0) {
            toast.success(`Đã thêm ${successCount} học sinh vào lớp`);
        }
        
        if (existingCount > 0) {
            toast.warning(`${existingCount} học sinh đã tồn tại trong lớp này`);
        }
        
        studentListModal.close();
        fetchStudents();
    } catch (error) {
        console.error('Error adding students:', error);
        toast.error('Lỗi khi thêm học sinh vào lớp');
    }
};

    // Filter students based on search term
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        students: filteredStudents,
        loading,
        searchTerm,
        studentListModal,
        handleSearchChange,
        handleRemoveStudent,
        handleAddStudents,
        fetchStudents,
        classListId
    };
};

export default useClassListTable;