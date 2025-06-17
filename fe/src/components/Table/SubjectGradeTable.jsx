/* eslint-disable no-unused-vars */
import { FaEdit, FaPlus, FaTrash, FaSort } from "react-icons/fa";
import ModalUpdateGrade from "../Modal/ModalUpdateGrade";
import ModalAddGrade from "../Modal/ModalAddGrade";
import ModalDeleteScore from "../Modal/ModalDeleteScore";
import ModalAddTestType from "../Modal/ModalAddTestType";
import TableHeaderAction from "../TableHeaderAction";
import useSubjectGradeTable from "../../hooks/useSubjectGradeTable";
import "../../styles/Table.scss";
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import ReactPaginate from "react-paginate";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import subjectGradeService from "../../services/subjectGradeService";
import { toast } from 'react-toastify';

const SubjectGradeTable = ({ filters }) => {
  const { user } = useContext(UserContext);
  const userPermissions = user?.account?.groupWithPermissions?.chucnangs || [];

  const canAdd = userPermissions.some(
    (p) => p.TenManHinhDuocLoad === "/report/add-score"
  );
  const canEdit = userPermissions.some(
    (p) => p.TenManHinhDuocLoad === "/report/edit-score"
  );
  const canDelete = userPermissions.some(
    (p) => p.TenManHinhDuocLoad === "/report/delete-score"
  );
  const canManageTestTypes = userPermissions.some(
    (p) => p.TenManHinhDuocLoad === "/test/create"
  );

  const {
    grades,
    loading,
    error,
    currentTarget,
    editModalOpen,
    addModalOpen,
    deleteModalOpen,
    openEditModal,
    closeEditModal,
    openAddModal,
    closeAddModal,
    openDeleteModal,
    closeDeleteModal,
    addGrade,
    updateGrade,
    removeGrade,
    testTypes,
    sortConfig,
    searchTerm,
    currentPage,
    totalPages,
    handlePageChange,
    handleSearchChange,
    handleSort,
    addTestTypeModalOpen,
    openAddTestTypeModal,
    closeAddTestTypeModal,
    addTestType
  } = useSubjectGradeTable(filters);

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

    // Tìm vị trí match trong normalizedText
    const regex = new RegExp(
      normalizedKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
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

      // Phần match (chuỗi gốc)
      //màu highlight
      result.push(
        <b key={start} style={{ color: "red" }}>
          {text.slice(start, end)}
        </b>
      );

      lastIndex = end;
    }
    // Phần còn lại sau cùng
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result.length > 0 ? result : text;
  };

  const handlePageClick = (e) => {
    handlePageChange(e.selected + 1);
  };

  const exportToExcel = async (filters, testTypes, searchTerm, sortConfig) => {
    try {
      const params = {
        tenLop: filters.class,
        tenHocKy: filters.semester,
        tenNamHoc: filters.year,
        tenMonHoc: filters.subject,
        page: 1,
        limit: 10000, // Lấy tối đa
        search: searchTerm,
        sortField: sortConfig.field,
        sortOrder: sortConfig.order,
      };

      const response = await subjectGradeService.getSubjectSummary(params);

      if (
        response?.data?.EC === 0 &&
        response?.data?.DT?.DT?.DiemChiTiet?.rows
      ) {
        const rows = response.data.DT.DT.DiemChiTiet.rows;

        const formattedData = rows.map((student) => {
          const row = {
            "Mã học sinh": student.MaHocSinh,
            "Họ và tên": student.HoTen,
          };

          // Thêm từng loại kiểm tra
          testTypes.forEach((type) => {
            const diem = student.DiemTP?.find(
              (d) => d.LoaiKiemTra === type.TenLoaiKiemTra
            )?.Diem ?? "";
            row[type.TenLoaiKiemTra] = diem;
          });

          row["Điểm trung bình"] = student.DiemTB ?? "";
          return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bảng điểm");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, `BangDiemMonHoc.xlsx`);
        toast.success("Xuất Excel thành công.");
      } else {
        toast.error(
          "Xuất Excel thất bại: " +
          (response?.data?.DT?.EM || response?.data?.EM || "Không xác định")
        );
      }
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      toast.error("Lỗi khi xuất file Excel");
    }
  };


  return (
    <div className="subjectgrade-table-wrapper">
      <TableHeaderAction
        onSearchChange={handleSearchChange}
        placeholder="Tìm kiếm học sinh..."
        addLabel="Thêm cột điểm"
        onAddClick={openAddTestTypeModal}
        hideAdd={!canManageTestTypes}
        onExportClick={() => exportToExcel(filters, testTypes, searchTerm, sortConfig)}
      />
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>
                  Mã học sinh
                  <button
                    className="sort-button"
                    title="Sắp xếp"
                    value="MaHocSinh"
                    onClick={() => handleSort("MaHocSinh")}
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
                    onClick={() => handleSort("HoTen")}
                  >
                    <FaSort />
                  </button>
                </th>
                {testTypes.map((type) => (
                  <th key={type.MaLoaiKiemTra}>
                    {type.TenLoaiKiemTra}

                    <button
                      className="sort-button"
                      title="Sắp xếp"
                      value={type.TenLoaiKiemTra}
                      onClick={() => handleSort(type.TenLoaiKiemTra.trim())}
                    >
                      <FaSort />
                    </button>
                  </th>
                ))}
                {/* {testTypes.map((type) => {
                  console.log(
                    "Rendering sort for field: '",
                    type.TenLoaiKiemTra,
                    "'"
                  );
                  return (
                    <th
                      key={type.MaLoaiKiemTra}
                      className="sortable-header"
                      onClick={() => handleSort(type.TenLoaiKiemTra.trim)}
                    >
                      {type.TenLoaiKiemTra}
                    </th>
                  );
                })} */}
                <th>
                  Điểm trung bình môn
                  <button
                    className="sort-button"
                    title="Sắp xếp"
                    value="DiemTB"
                    onClick={() => handleSort("DiemTB")}
                  >
                    <FaSort />
                  </button>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 && (
                <tr>
                  <td colSpan={testTypes.length + 4}>Không có dữ liệu điểm</td>
                </tr>
              )}
              {grades.map((student, idx) => (
                <tr key={student.id || idx}>
                  <td>{highlightText(student.id, searchTerm)}</td>
                  <td>{highlightText(student.name, searchTerm)} </td>
                  {testTypes.map((type) => (
                    <td key={type.MaLoaiKiemTra}>
                      {highlightText(
                        student.diemTP?.find(
                          (d) => d.LoaiKiemTra === type.TenLoaiKiemTra
                        )?.Diem ?? "",
                        searchTerm
                      )}
                    </td>
                  ))}
                  <td>{student.diemTB}</td>
                  <td>
                    <div className="action-buttons">
                      {canEdit && (
                        <button
                          className="icon-button edit"
                          title="Chỉnh sửa điểm"
                          onClick={() => openEditModal(student)}
                        >
                          <FaEdit />
                        </button>
                      )}
                      {/*canAdd && (
                        <button
                          className="icon-button add"
                          title="Thêm điểm mới"
                          onClick={() => openAddModal(student)}
                        >
                          <FaPlus />
                        </button>
                      )*/}
                      {canDelete && (
                        <button
                          className="icon-button delete"
                          title="Xóa điểm"
                          onClick={() => openDeleteModal(student)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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

      {editModalOpen && currentTarget && (
        <ModalUpdateGrade
          show={editModalOpen}
          handleClose={closeEditModal}
          grade={currentTarget}
          onSave={updateGrade}
          testTypes={testTypes}
        />
      )}
      {addModalOpen && (
        <ModalAddGrade
          show={addModalOpen}
          handleClose={closeAddModal}
          onAdd={addGrade}
          student={currentTarget}
          context={filters}
          testTypes={testTypes}
        />
      )}
      {deleteModalOpen && currentTarget && (
        <ModalDeleteScore
          show={deleteModalOpen}
          handleClose={closeDeleteModal}
          student={currentTarget}
          testTypes={testTypes}
          context={filters}
          onDelete={removeGrade}
        />
      )}
      {addTestTypeModalOpen && (
        <ModalAddTestType
          show={addTestTypeModalOpen}
          handleClose={closeAddTestTypeModal}
          onSubmit={addTestType}
        />
      )}
    </div>
  );
};

export default SubjectGradeTable;
