import { fetchAllStudent, deleteStudent } from "../services/studentServices";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useModal from "./useModal";

const useStudentTable = () => {
  const addModal = useModal();
  const updateModal = useModal();
  const deleteModal = useModal();

  const [listStudents, setListStudents] = useState([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(7);
  const [totalPages, setTotalPages] = useState(10);

  //Delete Modal
  const [dataModal, setDataModal] = useState({});

  //modal update/create user
  const [dataModalStudent, setDataModalStudent] = useState({}); // truyền dữ liệu vào modal

  //search
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async () => {
    let response = await fetchAllStudent(currentPage, currentLimit,searchTerm);
    if (response && response.data && response.data.EC === 0) {
      setTotalPages(response.data.DT.totalPages);
      setListStudents(response.data.DT.users); //set danh sách học sinh
    }
    console.log("check response", response.data);
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleDeleteStudent = async (user) => {
    deleteModal.open();
    setDataModal(user);
  };

  const confirmDeleteStudent = async () => {
    let response = await deleteStudent(dataModal);
    if (response && +response.data.EC === 0) {
      toast.success(response.data.EM);
      console.log("xóa thành công");
      await fetchStudents();
      deleteModal.close();
    } else {
      toast.error(response.data.EM);
    }
  };

  const handleEditStudent = (student) => {
    updateModal.open(); // mở modal
    setDataModalStudent(student); // truyền dữ liệu vào modal
    console.log("check data student", student);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    console.log("Search term:", value);
  };

  return {
    addModal,
    updateModal,
    deleteModal,
    listStudents,
    currentPage,
    totalPages,
    fetchStudents,
    handlePageClick,
    handleDeleteStudent,
    confirmDeleteStudent,
    handleEditStudent,
    dataModalStudent,
    dataModal,
    searchTerm,
    handleSearchChange 
  };
};
export default useStudentTable;
