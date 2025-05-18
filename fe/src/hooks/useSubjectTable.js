import { fetchAllSubject, deleteSubject } from "../services/subjectServices";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useModal from './useModal';

const useSubjectTable = () => {
    const addModal = useModal();
    const updateModal = useModal();
    const deleteModal = useModal();

    const [listSubjects, setListSubjects] = useState([]);


    //Delete Modal
    const [dataModal, setDataModal] = useState({});

    //modal update/create user
    const [dataModalSubject, setDataModalSubject] = useState({}); // truyền dữ liệu vào modal

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        let response = await fetchAllSubject();
        if (response && response.data && response.data.data) {
            setListSubjects(response.data.data); //set danh sách môn học
        }
        console.log("check response", response.data.data);
    };

    const handleDeleteSubject = async (user) => {
        deleteModal.open();
        setDataModal(user);
    };

    const confirmDeleteSubject = async () => {
        try {
            const response = await deleteSubject(dataModal);

            if (response && response.status === 200) {
                toast.success(response.data.message || "Xóa môn học thành công");
                console.log("Xóa thành công");
                await fetchSubjects();
                deleteModal.close();
            } else {
                toast.error(response?.data?.message || "Xóa thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi xóa môn học:", error);
            toast.error(error?.response?.data?.message || "Lỗi khi xóa môn học");
        }
    };


    const handleEditSubject = (subject) => {
        updateModal.open(); // mở modal
        setDataModalSubject(subject); // truyền dữ liệu vào modal
        console.log("check data subject", subject);
    };
    return {
        addModal,
        updateModal,
        deleteModal,
        listSubjects,
        fetchSubjects,
        handleDeleteSubject,
        confirmDeleteSubject,
        handleEditSubject,
        dataModalSubject,
        dataModal
    }
}
export default useSubjectTable;
