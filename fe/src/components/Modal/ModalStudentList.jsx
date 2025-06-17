import { useState, useEffect, useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { fetchAllStudent } from "../../services/studentServices";
import {
  addStudentToClass,
  getClassListByNameAndYear,
} from "../../services/classListService";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

const ModalStudentList = ({
  show,
  handleClose,
  selectedYear,
  selectedClass,
  onSave,
  maxClassSize,
  currentStudentCount,
  existingStudentIds,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(100);
  const [totalPages, setTotalPages] = useState(10);

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  useEffect(() => {
    if (show) {
      fetchAvailableStudents(); // Fetch students only when modal is shown
      setSelectedStudents([]);
    }
  }, [show, currentPage, currentLimit, searchTerm]);

  const fetchAvailableStudents = async () => {
    //setLoading(true);

    try {
      // Then, get all students
      const response = await fetchAllStudent(
        currentPage,
        currentLimit,
        searchTerm,
        "MaHocSinh",
        "asc"
      );
      if (response?.data?.DT?.users) {
        // Filter out students already in the class
        const allStudents = response.data.DT.users;
        // Chỉ lấy học sinh có trạng thái "Đang học" hoặc null
        const filteredByStatus = allStudents.filter(
          (student) =>
            student.TrangThaiHoc === "Đang học" || student.TrangThaiHoc == null
        );
        const availableStudents = filteredByStatus.filter(
          (student) => !existingStudentIds.includes(student.MaHocSinh)
        );
        if (response && response.data && response.data.EC === 0) {
          setTotalPages(response.data.DT.totalPages);
        }

        setStudents(availableStudents);
      } else {
        toast.error("Không thể tải danh sách học sinh");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  // Tính toán số suất còn lại để cho phép thêm học sinh hay không
  const remainingSlots = useMemo(() => {
    if (maxClassSize === null || maxClassSize === undefined) return Infinity;
    return maxClassSize - currentStudentCount;
  }, [maxClassSize, currentStudentCount]);

  const toggleStudentSelection = (student) => {
    const studentID = student.MaHocSinh;
    const isSelected = selectedStudents.includes(studentID);

    if (isSelected) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentID));
    } else {
      // Kiểm tra sĩ số trước khi thêm vào mảng lựa chọn
      if (selectedStudents.length >= remainingSlots) {
        toast.warn(
          `Không thể chọn thêm. Lớp đã hoặc sẽ đạt sĩ số tối đa là ${maxClassSize}.`
        );
        return; // Dừng lại, không cho chọn nữa
      }
      setSelectedStudents([...selectedStudents, studentID]);
    }
  };

  const toggleAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      if (filteredStudents.length > remainingSlots) {
        toast.warn(
          `Không thể chọn tất cả. Chỉ có thể chọn thêm ${remainingSlots} học sinh.`
        );
        const studentsToSelect = filteredStudents
          .slice(0, remainingSlots)
          .map((s) => s.MaHocSinh);
        setSelectedStudents(studentsToSelect);
      } else {
        // Chọn tất cả học sinh hiện có trong danh sách đã lọc
        setSelectedStudents(
          filteredStudents.map((student) => student.MaHocSinh)
        );
      }
    }
  };

  const handleSaveChanges = async () => {
    if (onSave) {
      onSave(selectedStudents);
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.HoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.MaHocSinh?.toString().includes(searchTerm)
  );

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>DANH SÁCH HỌC SINH</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <hr />
        <div className="mb-3 d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="light" className="ms-2">
            🔍
          </Button>
        </div>

        <div
          className="table-responsive"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <table className="table table-bordered table-striped">
            <thead className="table-success text-center">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selectedStudents.length === filteredStudents.length &&
                      filteredStudents.length > 0
                    }
                    onChange={toggleAllStudents}
                  />
                </th>
                <th>Mã học sinh</th>
                <th>Họ và tên</th>
                <th>Giới tính</th>
                <th>Năm sinh</th>
                <th>Địa chỉ</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.MaHocSinh}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.MaHocSinh)}
                        onChange={() => toggleStudentSelection(student)}
                      />
                    </td>
                    <td>{student.MaHocSinh}</td>
                    <td>{student.HoTen}</td>
                    <td>{student.GioiTinh}</td>
                    <td>
                      {student.NgaySinh
                        ? new Date(student.NgaySinh).getFullYear()
                        : ""}
                    </td>
                    <td>{student.DiaChi}</td>
                    <td>{student.Email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Không tìm thấy học sinh
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* pagination */}
        {totalPages > 0 && (
          <div className="student-footer">
            <ReactPaginate
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={totalPages}
              previousLabel="Previous"
              pageClassName="page-item"
              pageLinkClassName="number page-link"
              previousClassName="page-item"
              previousLinkClassName="prev page-link"
              nextClassName="page-item"
              nextLinkClassName="next page-link"
              nextLabel="Next"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="break page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
              forcePage={currentPage - 1} // reset trang hiện tại khi sort
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveChanges}
          disabled={selectedStudents.length === 0}
        >
          Lưu thay đổi ({selectedStudents.length})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalStudentList;
