/* eslint-disable no-unused-vars */
import "../../styles/Table/ClassTable.scss";
import { FaEdit, FaTrash } from "react-icons/fa";
import useModal from "../../hooks/useModal";
import ModalAddClass from "../Modal/ModalAddClass";
import ModalUpdateClass from "../Modal/ModalUpdateClass";
import ModalDeleteClass from "../Modal/ModalDeleteClass";
import TableHeaderAction from "../TableHeaderAction";
import { use, useEffect, useState } from "react";
import { fetchAllClasses, fetchAllGrades } from "../../services/classService";
import useClassTable from "../../hooks/useClassTable";
import ReactPaginate from "react-paginate";

const ClassTable = () => {
  const {
    gradesList,
    classList,
    addModal,
    updateModal,
    deleteModal,
    selectedClass,
    handleAddClass,
    handleOpenUpdateModal,
    handleOpenDeleteModal,
    handleUpdateClass,
    handleDeleteClass,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useClassTable();

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
  };

  return (
    <div className="class-table-wrapper">
      <TableHeaderAction
        onAddClick={addModal.open}
        onSearchChange={(value) => console.log("Tìm kiếm:", value)}
        placeholder="Tìm kiếm lớp học..."
        addLabel="Thêm lớp học"
      />

      <div className="class-table-container">
        <table className="class-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên lớp học</th>
              <th>Khối lớp</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {classList.length > 0 ? (
              classList.map((classItem, index) => (
                <tr key={classItem.classId || classItem.id || index}>
                  <td>{(currentPage - 1) * 7 + index + 1}</td>
                  <td>{classItem.className || classItem.TenLop}</td>
                  <td>
                    {gradesList.find((g) => g.MaKhoi === classItem.MaKhoi)
                      ?.TenKhoi || ""}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-button edit"
                        onClick={() => handleOpenUpdateModal(classItem)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="icon-button delete"
                        onClick={() => handleOpenDeleteModal(classItem)}
                        title="Xoá"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="class-footer">
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
          />
        </div>
      )}

      {addModal.isOpen && (
        <ModalAddClass
          show={addModal.isOpen}
          handleClose={addModal.close}
          onSubmit={handleAddClass}
          fetchClass={fetchAllClasses}
          gradesList={gradesList}
        />
      )}
      {updateModal.isOpen && (
        <ModalUpdateClass
          show={updateModal.isOpen}
          handleClose={updateModal.close}
          classData={selectedClass}
          onSubmit={handleUpdateClass}
          fetchClasses={fetchAllClasses}
          gradesList={gradesList}
        />
      )}

      {deleteModal.isOpen && (
        <ModalDeleteClass
          show={deleteModal.isOpen}
          handleClose={deleteModal.close}
          classData={selectedClass}
          onSubmit={handleDeleteClass}
          fetchClasses={fetchAllClasses}
        />
      )}
    </div>
  );
};

export default ClassTable;
