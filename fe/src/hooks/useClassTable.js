/* eslint-disable no-unused-vars */
// ClassTable dùng để hiển thị danh sách các lớp, có chức năng xóa và cập nhật thông tin lớp
import { useState, useEffect } from "react";
import useModal from "./useModal";
import { toast } from "react-toastify";
import { fetchAllClasses, createClass, updateCurrentClass, deleteClass, fetchAllGrades } from "../services/classService";

const useClassTable = () => {
  // Modal management
  const addModal = useModal();
  const updateModal = useModal();
  const deleteModal = useModal();
  const [selectedClass, setSelectedClass] = useState(null);

  // Class list state
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalClasses, setTotalClasses] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  const [gradesList, setGradesList] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(false);

  // Fetch all grades
  const fetchGrades = async () => {
    setLoadingGrades(true);
    try {
      const res = await fetchAllGrades();
      if (res?.data?.EC === 0) {
        setGradesList(res.data.DT || []);
      } else {
        setGradesList([]);
        toast.error(res?.data?.EM || "Lỗi khi tải danh sách khối");
      }
    } catch (error) {
      setGradesList([]);
      toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoadingGrades(false);
    }
  }


  // Fetch all classes
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetchAllClasses(currentPage, currentLimit);
      if (res?.data?.EC === 0) {
        setTotalClasses(res.data.DT.totalRows || 0);
        setTotalPages(res.data.DT.totalPages || 0);
        setClassList(res.data.DT.classes || []);
      } else {
        setClassList([]);
        toast.error(res?.data?.EM || "Lỗi khi tải danh sách lớp");
      }
    } catch (error) {
      setClassList([]);
      toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchClasses();
    fetchGrades();
    // eslint-disable-next-line
  }, [currentPage]);

  // Pagination handler
  const handlePageClick = (event) => {
    const selected = +event.selected + 1;
    setCurrentPage(selected);
  };

  // Add a new class
  const handleAddClass = async (classData) => {
    try {
    
      const res = await createClass(classData);
      console.log("Check res", res)
      if (res?.data.EC === 0) {
        toast.success("Thêm lớp thành công");
        await fetchClasses();
        addModal.close();
      } else {
        toast.error(res?.EM || "Không thể thêm lớp");
      }
      return res;
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ", error);
      return { EC: -1 };
    }
  };

  // Open update modal
  const handleOpenUpdateModal = (classItem) => {
    setSelectedClass(classItem);
    updateModal.open();
  };

  // Update class
  const handleUpdateClass = async (updatedData) => {
    if (!updatedData) return;
    try {
      const id = updatedData.MaLop;
      const classData = {
        className: updatedData.TenLop,
        classGrade: updatedData.MaKhoi,
      };
      const res = await updateCurrentClass(id, classData);

      console.log("Check res", res)
      if (res?.data.EC === 0) {
        toast.success("Cập nhật lớp thành công");
        await fetchClasses();
        updateModal.close();
        setSelectedClass(null);
      } else {
        toast.error(res?.EM || "Không thể cập nhật lớp");
      }
      return res;
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ", error);
      return { EC: -1 };
    }
  };

  // Open delete modal
  const handleOpenDeleteModal = (classItem) => {
    setSelectedClass(classItem);
    deleteModal.open();
  };

  // Delete class
  const handleDeleteClass = async (id) => {
    if (!id) return;
    console.log("Check id", id)
    try {
      const res = await deleteClass(id);
      if (res?.data.EC === 0) {
        toast.success("Xóa lớp thành công");
        await fetchClasses();
        deleteModal.close();
        setSelectedClass(null);
      } else {
        toast.error(res?.EM || "Không thể xóa lớp");
      }
      return res;
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ", error);
      return { EC: -1 };
    }
  };

  return {
    addModal,
    updateModal,
    deleteModal,
    selectedClass,
    classList,
    gradesList,
    loading,
    currentPage,
    totalPages,
    setCurrentPage,
    handlePageClick,
    handleAddClass,
    handleOpenUpdateModal,
    handleUpdateClass,
    handleOpenDeleteModal,
    handleDeleteClass,
    fetchClasses,
    fetchGrades
  };
};

export default useClassTable;

