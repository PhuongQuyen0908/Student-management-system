/* eslint-disable no-unused-vars */
import "../../styles/Table.scss";
import { FaEdit, FaTrash, FaSort } from "react-icons/fa";
import ModalAddTestType from "../Modal/ModalAddTestType";
import ModalUpdateTestType from "../Modal/ModalUpdateTestType";
import ModalDeleteTestType from "../Modal/ModalDeleteTestType";
import TableHeaderAction from "../TableHeaderAction";
import useTestTypeTable from "../../hooks/useTestTypeTable";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const TestTypeTable = () => {
    const { user } = useContext(UserContext);
    const userPermissions = user?.account?.groupWithPermissions?.chucnangs || [];

    const canUpdate = userPermissions.some(p => p.TenManHinhDuocLoad === "/test/update");
    const canDelete = userPermissions.some(p => p.TenManHinhDuocLoad === "/test/delete");
    const canCreate = userPermissions.some(p => p.TenManHinhDuocLoad === "/test/create");

    const {
        testList,
        updateModal,
        deleteModal,
        addTestTypeModal,
        selectedTest,
        handleAddTestType,
        handleOpenUpdateModal,
        handleOpenDeleteModal,
        handleUpdateTest,
        handleDeleteTest,
        searchTerm,
        handleSearchChange,
        sortConfig,
        handleSort,
    } = useTestTypeTable();

    // Hàm highlight kết quả tìm kiếm
    const highlightText = (text, keyword) => {
        if (!keyword || !text) return text;
        if (typeof text !== "string") text = String(text);

        const normalizedText = text.toLowerCase();
        const normalizedKeyword = keyword.toLowerCase();

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

    const filteredTestList = testList.filter((test) => {
        const term = searchTerm.toLowerCase();
        return (
            test.MaLoaiKiemTra?.toString().toLowerCase().includes(term) ||
            test.TenLoaiKiemTra?.toLowerCase().includes(term) ||
            test.HeSo?.toString().toLowerCase().includes(term)
        );
    });

    const getSortedData = (data) => {
        if (!sortConfig || !sortConfig.key) return data;

        const sortedData = [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue == null) return 1;
            if (bValue == null) return -1;

            // Nếu là số, so sánh số
            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
            }

            // So sánh chuỗi
            return sortConfig.direction === "asc"
                ? aValue.toString().localeCompare(bValue.toString())
                : bValue.toString().localeCompare(aValue.toString());
        });

        return sortedData;
    };

    // Hàm xuất ra Excel
    const exportToExcel = () => {
        try {
            // Chuẩn bị dữ liệu
            const data = testList.map(test => ({
                "Mã loại kiểm tra": test.MaLoaiKiemTra,
                "Tên loại kiểm tra": test.TenLoaiKiemTra,
                "Hệ số": test.HeSo
            }));

            // Tạo worksheet
            const worksheet = XLSX.utils.json_to_sheet(data);

            // Tạo workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Loại kiểm tra");

            // Xuất file
            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });

            const blob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            saveAs(blob, "Danh_sach_loai_kiem_tra.xlsx");
            toast.success("Xuất Excel thành công!");
        } catch (error) {
            console.error("Lỗi khi xuất Excel:", error);
            toast.error("Xuất Excel thất bại");
        }
    };

    return (
        <div className="class-table-wrapper">
            <TableHeaderAction
                placeholder="Tìm kiếm loại kiểm tra..."
                addLabel="Thêm loại kiểm tra"
                onAddClick={addTestTypeModal.open}
                hideAdd={!canCreate}
                onSearchChange={handleSearchChange}
                onExportClick={exportToExcel}
            />

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                Mã loại kiểm tra
                                <button
                                    className="sort-button"
                                    title="Sắp xếp"
                                    onClick={() => handleSort("MaLoaiKiemTra")}
                                >
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Tên loại kiểm tra
                                <button
                                    className="sort-button"
                                    title="Sắp xếp"
                                    onClick={() => handleSort("TenLoaiKiemTra")}
                                >
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Hệ số
                                <button
                                    className="sort-button"
                                    title="Sắp xếp"
                                    onClick={() => handleSort("HeSo")}
                                >
                                    <FaSort />
                                </button>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {getSortedData(filteredTestList).length > 0 ? (
                            getSortedData(filteredTestList).map((test) => (
                                <tr key={test.MaLoaiKiemTra}>
                                    <td>{highlightText(test.MaLoaiKiemTra, searchTerm)}</td>
                                    <td>{highlightText(test.TenLoaiKiemTra, searchTerm)}</td>
                                    <td>{highlightText(test.HeSo, searchTerm)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {canUpdate && (
                                                <button className="icon-button edit" onClick={() => handleOpenUpdateModal(test)}>
                                                    <FaEdit />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button className="icon-button delete" onClick={() => handleOpenDeleteModal(test)}>
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4">Không có dữ liệu</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {addTestTypeModal.isOpen && (
                <ModalAddTestType
                    show={addTestTypeModal.isOpen}
                    handleClose={addTestTypeModal.close}
                    onSubmit={handleAddTestType}
                />
            )}
            {updateModal.isOpen && (
                <ModalUpdateTestType
                    show={updateModal.isOpen}
                    handleClose={updateModal.close}
                    testData={selectedTest}
                    onSubmit={handleUpdateTest}
                />
            )}
            {deleteModal.isOpen && (
                <ModalDeleteTestType
                    show={deleteModal.isOpen}
                    handleClose={deleteModal.close}
                    testData={selectedTest}
                    onSubmit={() => handleDeleteTest(selectedTest.MaLoaiKiemTra)}
                />
            )}
        </div>
    );
};

export default TestTypeTable;