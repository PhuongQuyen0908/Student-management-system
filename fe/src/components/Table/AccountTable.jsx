import '../../styles/Table.scss';
import TableHeaderAction from '../TableHeaderAction';
import { FaEdit, FaLock, FaSort } from 'react-icons/fa';
import ModalAddAccount from '../Modal/ModalAddAccount';
import ModalUpdateAccount from '../Modal/ModalUpdateAccount';
import ModalDeleteAccount from '../Modal/ModalDeleteAccount';
import useModal from '../../hooks/useModal';
import { useState } from 'react';

const AccountTable = () => {
    const [listAccounts] = useState([
        {
            id: 1,
            HoTen: 'Nguyễn Văn A',
            TenDangNhap: 'nguyenvana',
            SoDienThoai: '0912345678',
            NhomNguoiDung: 'Admin',
        },
        {
            id: 2,
            HoTen: 'Trần Thị B',
            TenDangNhap: 'tranthib',
            SoDienThoai: '0987654321',
            NhomNguoiDung: 'Giáo viên',
        },
        {
            id: 3,
            HoTen: 'Lê Văn C',
            TenDangNhap: 'levanc',
            SoDienThoai: '0901122334',
            NhomNguoiDung: 'Học sinh',
        },
    ]);

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

    return (
        <div className="student-table-wrapper">
            <TableHeaderAction
                onAddClick={addModal.open}
                onSearchChange={() => { }}
                placeholder="Tìm kiếm tài khoản..."
                addLabel="Thêm tài khoản"
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
                                    <td>{index + 1}</td>
                                    <td>{account.HoTen}</td>
                                    <td>{account.TenDangNhap}</td>
                                    <td>{account.SoDienThoai}</td>
                                    <td>{account.NhomNguoiDung}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="icon-button edit"
                                                onClick={() => handleEditAccount(account)}
                                                title="Chỉnh sửa"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="icon-button lock"
                                                onClick={() => handleDeleteAccount(account)}
                                                title="Xóa"
                                            >
                                                <FaLock />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">Không tìm thấy tài khoản</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {addModal.isOpen && (
                <ModalAddAccount
                    show={addModal.isOpen}
                    handleClose={addModal.close}
                    fetchAccounts={() => { }}
                />
            )}

            {updateModal.isOpen && (
                <ModalUpdateAccount
                    show={updateModal.isOpen}
                    handleClose={updateModal.close}
                    fetchAccounts={() => { }}
                    dataModalAccount={dataModalAccount}
                />
            )}

            {deleteModal.isOpen && (
                <ModalDeleteAccount
                    show={deleteModal.isOpen}
                    handleClose={deleteModal.close}
                    confirmDeleteAccount={() => { }}
                    dataModal={dataModal}
                />
            )}
        </div>
    );
};

export default AccountTable;
