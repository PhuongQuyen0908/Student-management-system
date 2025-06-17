import { useEffect, useContext } from 'react';
import '../../styles/Table.scss';
import { FaEdit, FaTrash, FaSort } from 'react-icons/fa';
import TableHeaderAction from '../TableHeaderAction';
import ReactPaginate from 'react-paginate';
import useSchoolYearTable from '../../hooks/useSchoolYearTable';
import ModalAddSchoolYear from '../Modal/ModalAddSchoolYear';
import ModalUpdateSchoolYear from '../Modal/ModalUpdateSchoolYear';
import ModalDeleteSchoolYear from '../Modal/ModalDeleteSchoolYear';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import { fetchAllSchoolYears} from "../../services/schoolYearService";

const SchoolYearTable = () => {
  const { user } = useContext(UserContext);
  const userPermissions = user?.account?.groupWithPermissions?.chucnangs || [];
  
  // Check permissions
  const canCreate = userPermissions.some(p => p.TenManHinhDuocLoad === "/year/create");
  const canUpdate = userPermissions.some(p => p.TenManHinhDuocLoad === "/year/update");
  const canDelete = userPermissions.some(p => p.TenManHinhDuocLoad === "/year/delete");

  const {
    addModal,
    updateModal,
    deleteModal,
    listSchoolYears,
    fetchSchoolYears,
    handleDeleteSchoolYear,
    confirmDeleteSchoolYear,
    handleEditSchoolYear,
    dataModalSchoolYear,
    handleSortChange,
    dataModal,
    totalPages,
    currentPage,
    handlePageClick,
    confirmAddSchoolYear,
    confirmUpdateSchoolYear,
    searchTerm,
    handleSearchChange
  } = useSchoolYearTable();

  useEffect(() => {
    fetchSchoolYears();
  }, [fetchSchoolYears]);

  // Text highlighting for search
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const highlightText = (text, keyword) => {
    if (!keyword || !text) return text;
    if (typeof text !== "string") text = String(text);

    const normalizedText = removeAccents(text.toLowerCase());
    const normalizedKeyword = removeAccents(keyword.toLowerCase());

    let result = [];
    let lastIndex = 0;

    const regex = new RegExp(
      normalizedKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
      "gi"
    );
    let match;

    while ((match = regex.exec(normalizedText)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      if (lastIndex < start) {
        result.push(text.slice(lastIndex, start));
      }

      result.push(
        <b key={start} style={{ color: "red" }}>
          {text.slice(start, end)}
        </b>
      );

      lastIndex = end;
    }

    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result.length > 0 ? result : text;
  };

  // Export to Excel
  const exportToExcel = async () => {
    try {
      // Use the service function correctly
      const response = await fetchAllSchoolYears({
        search: searchTerm,
        page: 1,
        limit: 10000,
        sortField: "MaNamHoc",
        sortOrder: "asc",
      });

      if (response && response.data && response.data.EC === 0) {
        const allSchoolYears = response.data.DT.schoolYears;

        const data = allSchoolYears.map((year) => ({
          "Mã năm học": year.MaNamHoc,
          "Tên năm học": year.TenNamHoc,
          "Năm bắt đầu": year.Nam1,
          "Năm kết thúc": year.Nam2,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách năm học");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const file = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(file, `DanhSachNamHoc.xlsx`);
        toast.success("Xuất Excel thành công.");
      } else {
        toast.error(
          "Xuất Excel thất bại: " + (response?.data?.EM || "Lỗi không xác định")
        );
      }
    } catch (error) {
      console.error("Error exporting school years to Excel:", error);
      toast.error("Lỗi khi xuất file Excel");
    }
  };

  return (
    <div className="schoolyear-table-wrapper">
      <TableHeaderAction
        onAddClick={addModal.open}
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        placeholder="Tìm kiếm năm học..."
        addLabel="Thêm năm học"
        onExportClick={exportToExcel}
        hideAdd={!canCreate}
      />

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>
                Mã năm học
                <button
                  className="sort-button"
                  title="Sắp xếp"
                  value="MaNamHoc"
                  onClick={() => handleSortChange("MaNamHoc")}
                >
                  <FaSort />
                </button>
              </th>
              <th>
                Tên năm học
                <button
                  className="sort-button"
                  title="Sắp xếp"
                  value="TenNamHoc"
                  onClick={() => handleSortChange("TenNamHoc")}
                >
                  <FaSort />
                </button>
              </th>
              <th>
                Năm bắt đầu
                <button
                  className="sort-button"
                  title="Sắp xếp"
                  value="Nam1"
                  onClick={() => handleSortChange("Nam1")}
                >
                  <FaSort />
                </button>
              </th>
              <th>
                Năm kết thúc
                <button
                  className="sort-button"
                  title="Sắp xếp"
                  value="Nam2"
                  onClick={() => handleSortChange("Nam2")}
                >
                  <FaSort />
                </button>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listSchoolYears && listSchoolYears.length > 0 ? (
              listSchoolYears.map((year, index) => (
                <tr key={`year-${index}`}>
                  <td>{highlightText(year.MaNamHoc, searchTerm)}</td>
                  <td>{highlightText(year.TenNamHoc, searchTerm)}</td>
                  <td>{highlightText(year.Nam1, searchTerm)}</td>
                  <td>{highlightText(year.Nam2, searchTerm)}</td>
                  <td>
                    <div className="action-buttons">
                      {canUpdate && (
                        <button
                          className="icon-button edit"
                          onClick={() => handleEditSchoolYear(year)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="icon-button delete"
                          onClick={() => handleDeleteSchoolYear(year)}
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
                <td colSpan="5">Không có dữ liệu</td>
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
            forcePage={currentPage - 1}
          />
        </div>
      )}

      {/* Modals */}
      {addModal.isOpen && (
        <ModalAddSchoolYear
          show={addModal.isOpen}
          handleClose={addModal.close}
          confirmAddSchoolYear={confirmAddSchoolYear}
        />
      )}

      {updateModal.isOpen && (
        <ModalUpdateSchoolYear
          show={updateModal.isOpen}
          handleClose={updateModal.close}
          confirmUpdateSchoolYear={confirmUpdateSchoolYear}
          dataModalSchoolYear={dataModalSchoolYear}
        />
      )}

      {deleteModal.isOpen && (
        <ModalDeleteSchoolYear
          show={deleteModal.isOpen}
          handleClose={deleteModal.close}
          confirmDeleteSchoolYear={confirmDeleteSchoolYear}
          dataModal={dataModal}
        />
      )}
    </div>
  );
};

export default SchoolYearTable;