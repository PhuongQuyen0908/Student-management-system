/* eslint-disable no-unused-vars */
import "../../styles/Table.scss";
import { FaEdit, FaTrash } from "react-icons/fa";
import ModalAddSubject from "../Modal/ModalAddSubject";
import ModalUpdateSubject from "../Modal/ModalUpdateSubject";
import ModalDeleteSubject from "../Modal/ModalDeleteSubject";
import TableHeaderAction from "../TableHeaderAction";
import ReactPaginate from "react-paginate";
import useSubjectTable from "../../hooks/useSubjectTable";
import { useEffect } from "react";
import "../../styles/Table.scss";

//ngày 2/06/2025
import { FaSort } from "react-icons/fa";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { fetchAllSubject } from "../../services/subjectServices";
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const SubjectTable = () => {
  const { user } = useContext(UserContext);
  const userPermissions = user?.account?.groupWithPermissions?.chucnangs || [];

  // Kiểm tra quyền từ userPermissions
  const canCreate = userPermissions.some(p => p.TenManHinhDuocLoad === "/subject/create");
  const canUpdate = userPermissions.some(p => p.TenManHinhDuocLoad === "/subject/update");
  const canDelete = userPermissions.some(p => p.TenManHinhDuocLoad === "/subject/delete");

  const {
    addModal,
    updateModal,
    deleteModal,
    listSubjects, // Danh sách môn học
    fetchSubjects, // Hàm lấy danh sách môn học
    handleDeleteSubject,
    confirmDeleteSubject,
    handleEditSubject,
    dataModalSubject,
    handleSortChange, // Hàm xử lý sự kiện sắp xếp
    dataModal,
    totalPages,
    currentPage,
    handlePageClick, // Hàm xử lý sự kiện phân trang
    searchTerm, // Từ khóa tìm kiếm
    handleSearchChange, // Hàm xử lý sự kiện tìm kiếm
    confirmAddSubject, // Hàm xác nhận thêm môn học
    confirmUpdateSubject, // Hàm xác nhận cập nhật môn học
  } = useSubjectTable();
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

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
      const end = start + match[0].length;

      // Phần trước match (chuỗi gốc)
      if (lastIndex < start) {
        result.push(text.slice(lastIndex, start));
      }
      // Phần match (chuỗi cần làm nổi bật)
      result.push(
        <span className="highlight" key={start}>
          {text.slice(start, end)}
        </span>
      );
      lastIndex = end;
    }

    // Phần sau match
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result;
  };

  const exportToExcel = async () => {
    try {
      const response = await fetchAllSubject(
        {
          search: searchTerm,
          page: 1,
          limit: 10000,
          sortField: "MaMonHoc",
          sortOrder: "asc"
        });

      if (response && response.data && response.data.EC === 0) {
        const allSubjects = response.data.DT.subjects;

        const data = allSubjects.map(subject => ({
          'Mã môn học': subject.MaMonHoc,
          'Tên môn học': subject.TenMonHoc,
          'Hệ số': subject.HeSo
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách học sinh');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        saveAs(file, `DanhSachMonHoc.xlsx`);
      } else {
        toast.error("Xuất Excel thất bại: " + response?.data?.EM || "Lỗi không xác định");
      }
    } catch (error) {
      console.error("Error exporting students to Excel:", error);
      toast.error("Lỗi khi xuất file Excel");
    }
  };

  return (
    <div className="subject-table-wrapper">
      <TableHeaderAction
        onAddClick={addModal.open}
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        placeholder="Tìm kiếm môn học..."
        addLabel="Thêm môn học"
        onExportClick={exportToExcel}
        hideAdd={!canCreate}
      />

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>
                Mã môn học
                <button
                  className="sort-button"
                  title="Sắp xếp"
                  value="MaMonHoc"
                  onClick={() => handleSortChange("MaMonHoc")}
                >
                  <FaSort />
                </button>
              </th>
              <th>
                Tên môn học
                <button
                  className="sort-button"
                  title="Sắp xếp"
                  value="TenMonHoc"
                  onClick={() => handleSortChange("TenMonHoc")}
                >
                  <FaSort />
                </button>
              </th>
              {/* <th>Số điểm đạt</th> */}
              <th>
                Hệ số
                <button
                  className="sort-button"
                  title="Sắp xếp"
                  value="HeSo"
                  onClick={() => handleSortChange("HeSo")}
                >
                  <FaSort />
                </button>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listSubjects && listSubjects.length > 0 ? (
              listSubjects.map((subject, index) => (
                <tr key={`subject-${index}`}>
                  <td>{highlightText(subject.MaMonHoc, searchTerm)}</td>
                  <td>{highlightText(subject.TenMonHoc, searchTerm)}</td>
                  <td>{highlightText(subject.HeSo, searchTerm)}</td>
                  <td>
                    <div className="action-buttons">
                      {canUpdate && (
                        <button
                          className="icon-button edit"
                          onClick={() => handleEditSubject(subject)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="icon-button delete"
                          onClick={() => handleDeleteSubject(subject)}
                          title="Xoá"
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

      {/* Pagination */}
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
            forcePage={currentPage - 1} // vì currentPage bắt đầu từ 1, trong khi ReactPaginate bắt đầu từ 0
          />
        </div>
      )}
      {/* Modals */}
      {addModal.isOpen && (
        <ModalAddSubject
          show={addModal.isOpen}
          handleClose={addModal.close}
          fetchSubjects={fetchSubjects}
          onSubmit={confirmAddSubject}
        />
      )}

      {updateModal.isOpen && (
        <ModalUpdateSubject
          show={updateModal.isOpen}
          handleClose={updateModal.close}
          fetchSubjects={fetchSubjects}
          dataModalSubject={dataModalSubject}
          onSubmit={confirmUpdateSubject}
        />
      )}

      {deleteModal.isOpen && (
        <ModalDeleteSubject
          show={deleteModal.isOpen}
          handleClose={deleteModal.close}
          dataModal={dataModal}
          onSubmit={confirmDeleteSubject}
        />
      )}
    </div>
  );
};

export default SubjectTable;
