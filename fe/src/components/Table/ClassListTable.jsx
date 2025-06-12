import React from "react";
import { FaEdit, FaSort, FaTrash } from "react-icons/fa";
import TableHeaderAction from "../TableHeaderAction";
import ModalStudentList from "../Modal/ModalStudentList";
import ModalDeleteStudentFromClass from "../Modal/ModalDeleteStudentFromClass";
import useClassListTable from "../../hooks/useClassListTable";
import "../../styles/Table.scss";
import ReactPaginate from "react-paginate";

const ClassListTable = ({ selectedYear, selectedClass, setStudentCount }) => {
  const {
    students,
    loading,
    searchTerm,
    studentListModal,
    pagination,
    currentPage,
    deleteModal,
    dataModal,
    handleSearchChange,
    handleRemoveStudent,
    handleAddStudents,
    handlePageChange,
    handleSortChange,
    confirmRemoveStudent,
    // fetchStudents,
    // classListId,
  } = useClassListTable(selectedYear, selectedClass, setStudentCount);

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const highlightText = (text, keyword) => {
    if (!keyword || !text) return text;
    if (typeof text !== "string") text = String(text);

    const normalizedText = removeAccents(text).toLowerCase();
    const normalizedKeyword = removeAccents(keyword).toLowerCase();

    let result = [];
    let lastIndex = 0;
    // Tìm vị trí match trong nomalizedText
    const regex = new RegExp(
      normalizedKeyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
      "gi"
    );
    let match;
    while ((match = regex.exec(normalizedText)) !== null) {
      const start = match.index;
      if (start > lastIndex) {
        result.push(text.substring(lastIndex, start));
      }
      result.push(
        <span className="highlight" key={start}>
          {text.substring(start, regex.lastIndex)}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }
    return result;
  };

  return (
    <div className="classlist-table-wrapper">
      <TableHeaderAction
        onAddClick={studentListModal.open}
        onSearchChange={(e) => handleSearchChange(e.target.value)}
        searchTerm={searchTerm}
        placeholder="Tìm kiếm học sinh..."
        addLabel="Thêm học sinh"
      />

      <div className="table-container">
        {loading ? (
          <div className="text-center my-3">Đang tải...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>
                  STT
                  <button
                    className="sort-button"
                    title="Sắp xếp"
                    value="MaHocSinh"
                    onClick={() => handleSortChange("MaHocSinh")}
                  >
                    <FaSort />
                  </button>
                </th>
                <th>
                  Họ và tên
                  <button
                    className="sort-button"
                    title="Sắp xếp"
                    value="HoTen"
                    onClick={() => handleSortChange("HoTen")}
                  >
                    <FaSort />
                  </button>
                </th>
                <th>
                  Giới tính
                  <button
                    className="sort-button"
                    title="Sắp xếp"
                    value="GioiTinh"
                    onClick={() => handleSortChange("GioiTinh")}
                  >
                    <FaSort />
                  </button>
                </th>
                <th>
                  Ngày sinh
                  <button
                    className="sort-button"
                    title="Sắp xếp"
                    value="NgaySinh"
                    onClick={() => handleSortChange("NgaySinh")}
                  >
                    <FaSort />
                  </button>
                </th>
                <th>
                  Địa chỉ
                  <button
                    className="sort-button"
                    title="Sắp xếp"
                    value="DiaChi"
                    onClick={() => handleSortChange("DiaChi")}
                  >
                    <FaSort />
                  </button>
                </th>
                <th>
                  Email
                  <button
                    className="sort-button"
                    title="Sắp xếp"
                    value="Email"
                    onClick={() => handleSortChange("Email")}
                  >
                    <FaSort />
                  </button>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr key={student.MaCT_DSL || student.id || index}>
                    <td>
                      {(pagination.currentPage - 1) * pagination.limit +
                        index +
                        1}
                    </td>
                    <td>{highlightText(student.HoTen, searchTerm)}</td>
                    <td>{highlightText(student.GioiTinh, searchTerm)}</td>
                    <td>{highlightText(student.NgaySinh, searchTerm)}</td>
                    <td>{highlightText(student.DiaChi, searchTerm)}</td>
                    <td>{highlightText(student.Email, searchTerm)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button delete"
                          title="Xoá"
                          onClick={() => {
                            console.log(student.MaCT_DSL);
                            handleRemoveStudent(student.MaCT_DSL);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Không có học sinh nào trong lớp này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* pagination */}
      {pagination.totalPages > 0 && (
        <div className="student-footer">
          <ReactPaginate
            onPageChange={handlePageChange}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pagination.totalPages}
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

      {studentListModal.isOpen && (
        <ModalStudentList
          show={studentListModal.isOpen}
          handleClose={studentListModal.close}
          selectedYear={selectedYear}
          selectedClass={selectedClass}
          onSave={handleAddStudents}
        />
      )}

      {deleteModal.isOpen && (
        <ModalDeleteStudentFromClass
          show={deleteModal.isOpen}
          handleClose={deleteModal.close}
          dataModal={dataModal}
          onSubmit={confirmRemoveStudent}
        />
      )}
    </div>
  );
};

export default ClassListTable;
