import '../../styles/Table.scss';
import TableHeaderAction from '../TableHeaderAction';
import { FaEdit, FaLock, FaSort } from 'react-icons/fa';
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

    const fetchAccounts = async () => {
        let response = await fetchAllUsers(currentPage, currentLimit);
        if (response && response.data && response.data.EC === 0) {
            setTotalPages(response.data.DT.totalPages);
            setListAccounts(response.data.DT.users); // set danh sách tài khoản
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [currentPage, currentLimit]);

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

    return (
        <div className="student-table-wrapper">
            <TableHeaderAction
                onAddClick={addModal.open}
                onSearchChange={() => { }}
                placeholder="Tìm kiếm tài khoản..."
                addLabel="Thêm tài khoản"
                hideAdd={!canCreate}
            />

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>STT
                                <button className="sort-button" title="Sắp xếp">
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Họ tên
                                <button className="sort-button" title="Sắp xếp">
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Tên đăng nhập
                                <button className="sort-button" title="Sắp xếp">
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Số điện thoại
                                <button className="sort-button" title="Sắp xếp">
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Vai trò
                                <button className="sort-button" title="Sắp xếp">
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
                                    {console.log(account)}
                                    <td>{index + 1}</td>
                                    <td>{account.HoTen}</td>
                                    <td>{account.TenDangNhap}</td>
                                    <td>{account.SoDienThoai}</td>
                                    <td>{account.nhomnguoidung.TenNhom}</td>
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
                                                    <FaLock />
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
