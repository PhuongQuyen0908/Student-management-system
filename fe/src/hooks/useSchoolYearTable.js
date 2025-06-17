import { useState, useEffect, useCallback } from "react";
import { fetchAllSchoolYears, deleteSchoolYear, createSchoolYear, updateSchoolYear } from "../services/schoolYearService";
import { toast } from "react-toastify";
import useModal from './useModal';

const useSchoolYearTable = () => {
  // Modal hooks
  const addModal = useModal();
  const updateModal = useModal();
  const deleteModal = useModal();
  
  // Data hooks
  const [listSchoolYears, setListSchoolYears] = useState([]);
  
  // Pagination hooks
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(7);
  
  // Delete Modal
  const [dataModal, setDataModal] = useState({});
  
  // Modal update/create data
  const [dataModalSchoolYear, setDataModalSchoolYear] = useState({});
  
  // Search
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sort
  const [sortField, setSortField] = useState("MaNamHoc");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchSchoolYears = useCallback(async () => {
    let response = await fetchAllSchoolYears({
      search: searchTerm,
      page: currentPage,
      limit: currentLimit,
      sortField,
      sortOrder
    });
    if (response && response.data && response.data.EC === 0) {
      setTotalPages(response.data.DT.totalPages);
      setListSchoolYears(response.data.DT.schoolYears);
    } else {
      setListSchoolYears([]);
    }
  }, [currentPage, currentLimit, searchTerm, sortField, sortOrder]);

  useEffect(() => {
    fetchSchoolYears();
  }, [fetchSchoolYears]);

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleAddSchoolYear = async () => {
    addModal.open();
    setDataModalSchoolYear({});
  };

  const confirmAddSchoolYear = async (schoolYearData) => {
    try {
      let response = await createSchoolYear(schoolYearData);
      if (response.data.EC === 0) {
        toast.success(response.data.EM || "Thêm năm học thành công");
        await fetchSchoolYears();
        addModal.close();
      } else {
        toast.error(response.data.EM || "Năm học đã tồn tại");
      }
      return response;
    } catch (error) {
      if (error?.response?.status === 400) {
        toast.error(error.response.data.EM || "Năm học đã tồn tại");
      } else {
        toast.error("Lỗi khi thêm năm học");
      }
      return { data: { EC: -1, EM: "Lỗi khi thêm năm học" } };
    }
  };

  const handleDeleteSchoolYear = async (schoolYear) => {
    deleteModal.open();
    setDataModal(schoolYear);
  };

  const confirmDeleteSchoolYear = async () => {
    try {
      const response = await deleteSchoolYear(dataModal);
      
      // Handle both standard and non-standard response formats
      if (response?.data?.EC === 0 || response?.data?.message) {
        toast.success(response.data?.EM || response.data?.message || "Xóa năm học thành công");
        
        // Refresh the data
        await fetchSchoolYears();
        
        // Reset state and close modal
        setDataModal({});
        deleteModal.close();
      } else {
        toast.error(response?.data?.EM || response?.data?.message || "Lỗi khi xóa năm học");
      }
    } catch (error) {
      console.error("Lỗi khi xóa năm học:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.EM || error.response.data.message || "Lỗi khi xóa năm học");
      } else {
        toast.error("Không thể kết nối đến máy chủ");
      }
    }
  };

  const handleEditSchoolYear = (schoolYear) => {
    updateModal.open();
    setDataModalSchoolYear(schoolYear);
  };

  const confirmUpdateSchoolYear = async (schoolYearData) => {
    try {
      const response = await updateSchoolYear(schoolYearData.MaNamHoc, schoolYearData);
      
      // Handle the non-standard response format from the backend
      if (response && response.data && (response.data.EC === 0 || response.data.message)) {
        // Show success message from either standard or non-standard response
        toast.success(response.data.EM || response.data.message || "Cập nhật năm học thành công");
        
        // Fetch the updated list
        await fetchSchoolYears();
        
        // Close modal and reset data
        updateModal.close();
        setDataModalSchoolYear({});
        return true;
      } else {
        toast.error(response.data?.EM || response.data?.message || "Lỗi khi cập nhật năm học");
        return false;
      }
    } catch (error) {
      console.error("Error updating school year:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.EM || error.response.data.message || "Lỗi khi cập nhật năm học");
      } else {
        toast.error("Không thể kết nối đến máy chủ");
      }
      return false;
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  return {
    addModal,
    updateModal,
    deleteModal,
    listSchoolYears,
    totalPages,
    currentPage,
    currentLimit,
    searchTerm,
    sortField,
    sortOrder,
    dataModal,
    dataModalSchoolYear,
    fetchSchoolYears,
    handlePageClick,
    handleAddSchoolYear,
    confirmAddSchoolYear,
    handleDeleteSchoolYear,
    confirmDeleteSchoolYear,
    handleEditSchoolYear,
    confirmUpdateSchoolYear,
    handleSearchChange,
    handleSortChange
  };
};

export default useSchoolYearTable;