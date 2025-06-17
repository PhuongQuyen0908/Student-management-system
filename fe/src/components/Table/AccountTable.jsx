import '../../styles/Table.scss';
import TableHeaderAction from '../TableHeaderAction';
import { FaEdit, FaLock, FaSort, FaTrash } from 'react-icons/fa';
import ModalAddAccount from '../Modal/ModalAddAccount';
import ModalUpdateAccount from '../Modal/ModalUpdateAccount';
import ModalDeleteAccount from '../Modal/ModalDeleteAccount';
import useModal from '../../hooks/useModal';
import { useEffect, useState } from 'react';
//import mới 06/06/2025
import ReactPaginate from 'react-paginate';
import { fetchAllUsers, deleteUser } from '../../services/userServices';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const AccountTable = () => {
    const { user } = useContext(UserContext);
    const userPermissions = user?.account?.groupWithPermissions?.chucnangs || [];

    // Kiểm tra quyền từ userPermissions
    const canCreate = userPermissions.some(p => p.TenManHinhDuocLoad === "/user/create");
    const canUpdate = userPermissions.some(p => p.TenManHinhDuocLoad === "/user/update");
    const canDelete = userPermissions.some(p => p.TenManHinhDuocLoad === "/user/delete");

    const [listAccounts, setListAccounts] = useState([]);

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(7);
    const [totalPages, setTotalPages] = useState(10);
    //search
    const [searchTerm, setSearchTerm] = useState("");
    //sort
    const [sortField, setSortField] = useState("HoTen");
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchAccounts = async () => {
        let response = await fetchAllUsers(currentPage, currentLimit, searchTerm, sortField, sortOrder);
        if (response && response.data && response.data.EC === 0) {
            setTotalPages(response.data.DT.totalPages);
            setListAccounts(response.data.DT.users); // set danh sách tài khoản
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [currentPage, currentLimit, searchTerm, sortField, sortOrder]);

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    }

    const addModal = useModal();
    const updateModal = useModal();
    const deleteModal = useModal();

    const [dataModalAccount, setDataModalAccount] = useState(null);
    const [dataModal, setDataModal] = useState(null);

    const handleEditAccount = (account) => {
        setDataModalAccount(account);
        updateModal.open();
    };

    const handleDeleteAccount = (account) => {
        setDataModal(account);
        deleteModal.open();
    };

    const confirmDeleteAccount = async () => {
        let response = await deleteUser(dataModal);
        if (response && +response.data.EC === 0) {
            toast.success(response.data.EM);
            await fetchAccounts();
            deleteModal.close();
        } else {
            toast.error(response.data.EM);
        }
    };


    //Search Accounts

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
    }
    // Sort Accounts

    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
        setCurrentPage(1); // Reset to first page on sort change
    };


    // highlightText function để làm nổi bật từ khóa tìm kiếm trong bảng
    // Hàm remove dấu tiếng Việt
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
        const regex = new RegExp(normalizedKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "gi");
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

    const exportToExcel = async () => {
        try {
            const response = await fetchAllUsers(1, 10000, searchTerm, sortField, sortOrder);

            if (response && response.data && response.data.EC === 0) {
                const allAccounts = response.data.DT.users;

                const data = allAccounts.map(user => ({
                    'Họ tên': user.HoTen,
                    'Tên đăng nhập': user.TenDangNhap,
                    'Số điện thoại': user.SoDienThoai,
                    'Vai trò': user.nhomnguoidung?.TenNhom || '',
                }));

                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách tài khoản');

                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const file = new Blob([excelBuffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                saveAs(file, `DanhSachTaiKhoan.xlsx`);
                toast.success("Xuất Excel thành công.");
            } else {
                toast.error("Xuất Excel thất bại: " + (response?.data?.EM || "Lỗi không xác định"));
            }
        } catch (error) {
            console.error("Error exporting accounts to Excel:", error);
            toast.error("Lỗi khi xuất file Excel");
        }
    };


    return (
        <div className="student-table-wrapper">
            <TableHeaderAction
                onAddClick={addModal.open}
                onSearchChange={(e) => { handleSearchChange(e) }}
                placeholder="Tìm kiếm tài khoản..."
                addLabel="Thêm tài khoản"
                hideAdd={!canCreate}
                onExportClick={exportToExcel}
            />

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>STT
                                <button className="sort-button" title="Sắp xếp"  >
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Họ tên
                                <button className="sort-button" title="Sắp xếp" onClick={() => handleSort("HoTen")}>
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Tên đăng nhập
                                <button className="sort-button" title="Sắp xếp" onClick={() => handleSort("TenDangNhap")}>
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Số điện thoại
                                <button className="sort-button" title="Sắp xếp" onClick={() => handleSort("SoDienThoai")}>
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Vai trò
                                <button className="sort-button" title="Sắp xếp" onClick={() => handleSort("TenNhom")}>
                                    <FaSort />
                                </button>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listAccounts && listAccounts.length > 0 ? (
                            listAccounts.map((account, index) => (
                                <tr key={`account-${index}`}>
                                    <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                                    <td>{highlightText(account.HoTen, searchTerm)}</td>
                                    <td>{highlightText(account.TenDangNhap, searchTerm)}</td>
                                    <td>{highlightText(account.SoDienThoai, searchTerm)}</td>
                                    <td>{highlightText(account.nhomnguoidung.TenNhom, searchTerm)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {canUpdate && (
                                                <button
                                                    className="icon-button edit"
                                                    onClick={() => handleEditAccount(account)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <FaEdit />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    className="icon-button lock"
                                                    onClick={() => handleDeleteAccount(account)}
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
                                <td colSpan="5">Không tìm thấy tài khoản</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* pagination */}
            {totalPages > 0 &&
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
            }

            {addModal.isOpen && (
                <ModalAddAccount
                    show={addModal.isOpen}
                    handleClose={addModal.close}
                    fetchAccounts={fetchAccounts}
                />
            )}

            {updateModal.isOpen && (
                <ModalUpdateAccount
                    show={updateModal.isOpen}
                    handleClose={updateModal.close}
                    fetchAccounts={fetchAccounts}
                    dataModalAccount={dataModalAccount}
                />
            )}

            {deleteModal.isOpen && (
                <ModalDeleteAccount
                    show={deleteModal.isOpen}
                    handleClose={deleteModal.close}
                    confirmDeleteAccount={confirmDeleteAccount}
                    dataModal={dataModal}
                />
            )}
        </div>
    );
};

export default AccountTable;
