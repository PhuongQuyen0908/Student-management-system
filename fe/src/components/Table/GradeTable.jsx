/* eslint-disable no-unused-vars */
import "../../styles/Table.scss";
import { FaEdit, FaSort, FaTrash } from "react-icons/fa";
import ModalAddGradeClass from "../Modal/ModalAddGradeClass";
import ModalUpdateGradeClass from "../Modal/ModalUpdateGradeClass";
import ModalDeleteGradeClass from "../Modal/ModalDeleteGradeClass";
import TableHeaderAction from "../TableHeaderAction";
import useGradeTable from "../../hooks/useGradeTable";
import ReactPaginate from "react-paginate";
import { useEffect, useContext } from "react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { fetchAllGrades } from "../../services/gradeService";
import { toast } from 'react-toastify';
import { UserContext } from "../../context/UserContext";

const GradeTable = () => {
    const { user } = useContext(UserContext);
    const userPermissions = user?.account?.groupWithPermissions?.chucnangs || []

    const canCreate = userPermissions.some(p => p.TenManHinhDuocLoad === "/classGrade/create");
    const canUpdate = userPermissions.some(p => p.TenManHinhDuocLoad === "/classGrade/update");
    const canDelete = userPermissions.some(p => p.TenManHinhDuocLoad === "/classGrade/delete");
    const {
        gradeList,
        addModal,
        updateModal,
        deleteModal,
        selectedGrade,
        handleAddGrade,
        handleOpenUpdateModal,
        handleOpenDeleteModal,
        handleUpdateGrade,
        handleDeleteGrade,
        handleSortChange,
        handleSearchChange,
        handlePageClick,
        searchTerm,
        totalPages,
        currentPage,
        sortField,
        sortOrder,
        fetchGrades,
    } = useGradeTable();

    const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const highlightText = (text, keyword) => {
        if (!keyword || !text) return text;
        if (typeof text !== "string") text = String(text);

        const normalizedText = removeAccents(text).toLowerCase();
        const normalizedKeyword = removeAccents(keyword).toLowerCase();
        const regex = new RegExp(normalizedKeyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "gi");

        const result = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(normalizedText)) !== null) {
            const start = match.index;
            if (start > lastIndex) result.push(text.substring(lastIndex, start));
            result.push(<span className="highlight" key={start}>{text.substring(start, regex.lastIndex)}</span>);
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) result.push(text.substring(lastIndex));
        return result;
    };

    useEffect(() => {
        fetchGrades();
    }, [currentPage, searchTerm, sortField, sortOrder]);

    const exportToExcel = async () => {
        try {
            const response = await fetchAllGrades({
                search: searchTerm,
                page: 1,
                limit: 10000,
                sortField,
                sortOrder,
            });

            if (response?.data?.EC === 0) {
                const allGrades = response.data.DT.grades;

                const data = allGrades.map(g => ({
                    'Mã khối': g.MaKhoi,
                    'Tên khối': g.TenKhoi,
                }));

                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách khối lớp');

                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const file = new Blob([excelBuffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                saveAs(file, "QuanLyKhoiLop.xlsx");
                toast.success("Xuất Excel thành công.");
            } else {
                toast.error("Xuất Excel thất bại: " + (response?.data?.EM || "Lỗi không xác định"));
            }
        } catch (error) {
            console.error("Error exporting grades to Excel:", error);
            toast.error("Lỗi khi xuất file Excel");
        }
    };

    return (
        <div className="class-table-wrapper">
            <TableHeaderAction
                onAddClick={addModal.open}
                onSearchChange={handleSearchChange}
                searchTerm={searchTerm}
                placeholder="Tìm kiếm khối lớp..."
                addLabel="Thêm khối lớp"
                onExportClick={exportToExcel}
                hideAdd={!canCreate}
            />

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                Mã khối
                                <button className="sort-button" onClick={() => handleSortChange("MaKhoi")}>
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Tên khối
                                <button className="sort-button" onClick={() => handleSortChange("TenKhoi")}>
                                    <FaSort />
                                </button>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {gradeList.length > 0 ? (
                            gradeList.map((grade) => (
                                <tr key={grade.MaKhoi}>
                                    <td>{highlightText(grade.MaKhoi, searchTerm)}</td>
                                    <td>{highlightText(grade.TenKhoi, searchTerm)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {canUpdate && (
                                                <button className="icon-button edit" onClick={() => handleOpenUpdateModal(grade)}>
                                                    <FaEdit />
                                                </button>
                                            )}

                                            {canDelete && (
                                                <button className="icon-button delete" onClick={() => handleOpenDeleteModal(grade)}>
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3">Không tìm thấy khối lớp</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 0 && (
                <div className="class-footer">
                    <ReactPaginate
                        onPageChange={handlePageClick}
                        pageCount={totalPages}
                        forcePage={currentPage - 1}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        previousLabel="Previous"
                        nextLabel="Next"
                        breakLabel="..."
                        containerClassName="pagination"
                        activeClassName="active"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                    />
                </div>
            )}

            {addModal.isOpen && (
                <ModalAddGradeClass
                    show={addModal.isOpen}
                    handleClose={addModal.close}
                    onSubmit={handleAddGrade}
                    fetchGrades={fetchGrades}
                />
            )}
            {updateModal.isOpen && (
                <ModalUpdateGradeClass
                    show={updateModal.isOpen}
                    handleClose={updateModal.close}
                    gradeData={selectedGrade}
                    onSubmit={handleUpdateGrade}
                />
            )}
            {deleteModal.isOpen && (
                <ModalDeleteGradeClass
                    show={deleteModal.isOpen}
                    handleClose={deleteModal.close}
                    gradeData={selectedGrade}
                    onSubmit={handleDeleteGrade}
                />
            )}
        </div>
    );
};

export default GradeTable;
