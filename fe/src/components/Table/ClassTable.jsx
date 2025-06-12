/* eslint-disable no-unused-vars */
import "../../styles/Table.scss";
import { FaEdit, FaSort, FaTrash } from "react-icons/fa";
import ModalAddClass from "../Modal/ModalAddClass";
import ModalUpdateClass from "../Modal/ModalUpdateClass";
import ModalDeleteClass from "../Modal/ModalDeleteClass";
import TableHeaderAction from "../TableHeaderAction";
import useClassTable from "../../hooks/useClassTable";
import ReactPaginate from "react-paginate";
import "../../styles/Table.scss";
import { useEffect } from "react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { fetchAllClasses } from "../../services/classService";
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const ClassTable = () => {
  const { user } = useContext(UserContext);
  const userPermissions = user?.account?.groupWithPermissions?.chucnangs || [];

  // Kiểm tra quyền từ userPermissions
  const canCreate = userPermissions.some(p => p.TenManHinhDuocLoad === "/class/create");
  const canUpdate = userPermissions.some(p => p.TenManHinhDuocLoad === "/class/update");
  const canDelete = userPermissions.some(p => p.TenManHinhDuocLoad === "/class/delete");
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
    handleSortChange,
    handleSearchChange,
    handlePageClick,
    searchTerm,
    totalPages,
    currentPage,
    fetchClasses,
    fetchGrades,
  } = useClassTable();

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  // Hàm highlightText để làm nổi bật từ khóa tìm kiếm trong bảng
  const highlightText = (text, keyword) => {
    if (!keyword || !text) return text;
    if (typeof text !== "string") text = String(text);

    const normalizedText = removeAccents(text).toLowerCase();
    const normalizedKeyword = removeAccents(keyword).toLowerCase();

    let result = [];
    let lastIndex = 0;

    // Tìm vị trí match trong normalizedText
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

  useEffect(() => {
    fetchGrades();
  }, [])

  const exportToExcel = async () => {
    try {
      const response = await fetchAllClasses(
        {
          search: searchTerm,
          page: 1,
          limit: 10000,
          sortField: "MaLop",
          sortOrder: "asc"
        });

      if (response && response.data && response.data.EC === 0) {
        const allClasses = response.data.DT.classes;

        const data = allClasses.map(classes => ({
          'Mã lớp học': classes.MaLop,
          'Tên lớp học': classes.TenLop,
          'Khối lớp': classes.TenKhoi
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách học sinh');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        saveAs(file, `QuanLyLopHoc.xlsx`);
      } else {
        toast.error("Xuất Excel thất bại: " + response?.data?.EM || "Lỗi không xác định");
      }
    } catch (error) {
      console.error("Error exporting students to Excel:", error);
      toast.error("Lỗi khi xuất file Excel");
    }
  };

  return (
    <div className="class-table-wrapper">
      <TableHeaderAction
        onAddClick={addModal.open}
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        placeholder="Tìm kiếm lớp học..."
        addLabel="Thêm lớp học"
        onExportClick={exportToExcel}
        hideAdd={!canCreate}
      />

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>
                Mã lớp học
                <button
                  className="sort-button"
                  value={"MaLop"}
                  onClick={() => handleSortChange("MaLop")}
                  title="Sắp xếp"
                >
                  <FaSort />
                </button>
              </th>
              <th>
                Tên lớp học
                <button
                  className="sort-button"
                  value={"TenLop"}
                  onClick={() => handleSortChange("TenLop")}
                  title="Sắp xếp"
                >
                  <FaSort />
                </button>
              </th>
              <th>
                Khối lớp
                <button
                  className="sort-button"
                  value={"MaKhoi"}
                  onClick={() => handleSortChange("MaKhoi")}
                  title="Sắp xếp"
                >
                  <FaSort />
                </button>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {classList.length > 0 ? (
              classList.map((classItem) => (
                <tr key={classItem.MaLop}>
                  <td>{highlightText(classItem.MaLop, searchTerm)}</td>
                  <td>{highlightText(classItem.TenLop, searchTerm)}</td>
                  <td>
                    {highlightText(classItem.khoi?.TenKhoi || "", searchTerm)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {canUpdate && (
                        <button
                          className="icon-button edit"
                          onClick={() => handleOpenUpdateModal(classItem)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                      )}
                      {canUpdate && (
                        <button
                          className="icon-button delete"
                          onClick={() => handleOpenDeleteModal(classItem)}
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Bạn không có quyền xem danh sách</td>
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
          fetchClass={fetchClasses}
          gradesList={gradesList}
          fetchGrades={fetchGrades}
        />
      )}
      {updateModal.isOpen && (
        <ModalUpdateClass
          show={updateModal.isOpen}
          handleClose={updateModal.close}
          classData={selectedClass}
          onSubmit={handleUpdateClass}
          fetchClass={fetchClasses}
          gradesList={gradesList}
        />
      )}

      {deleteModal.isOpen && (
        <ModalDeleteClass
          show={deleteModal.isOpen}
          handleClose={deleteModal.close}
          classData={selectedClass}
          onSubmit={handleDeleteClass}
          fetchClass={fetchClasses}
        />
      )}
    </div>
  );
};

export default ClassTable;
