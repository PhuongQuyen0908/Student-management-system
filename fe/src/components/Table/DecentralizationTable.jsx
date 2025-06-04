import '../../styles/Table.scss';
import TableHeaderAction from '../TableHeaderAction';
import { FaPuzzlePiece, FaSort } from 'react-icons/fa';
import ModalAssignFunction from '../Modal/ModalAssignFunction';
import ModalAddUserGroup from '../Modal/ModalAddUserGroup';
import useModal from '../../hooks/useModal';
import { useState } from 'react';

const DecentralizationTable = () => {
    const [listRoles, setListRoles] = useState([
        { id: 1, TenNhomQuyen: 'Admin' },
        { id: 2, TenNhomQuyen: 'Giáo viên' },
        { id: 3, TenNhomQuyen: 'Học sinh' },
    ]);

    const addRoleModal = useModal();
    const assignModal = useModal();

    const [selectedRole, setSelectedRole] = useState(null);

    const handleAssignPermission = (role) => {
        setSelectedRole(role);
        assignModal.open();
    };

    const handleAddRole = (newRole) => {
        setListRoles((prev) => [...prev, { id: Date.now(), TenNhomQuyen: newRole }]);
        addRoleModal.close();
    };

    return (
        <div className="student-table-wrapper">
            <TableHeaderAction
                onAddClick={addRoleModal.open}
                onSearchChange={() => { }}
                placeholder="Tìm kiếm nhóm quyền..."
                addLabel="Thêm nhóm quyền"
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
                                Tên nhóm quyền
                                <button className="sort-button" title="Sắp xếp">
                                    <FaSort />
                                </button>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listRoles.length > 0 ? (
                            listRoles.map((role, index) => (
                                <tr key={`role-${role.id}`}>
                                    <td>{index + 1}</td>
                                    <td>{role.TenNhomQuyen}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="icon-button assign"
                                                onClick={() => handleAssignPermission(role)}
                                                title="Gán chức năng"
                                            >
                                                <FaPuzzlePiece />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Không tìm thấy nhóm quyền</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {addRoleModal.isOpen && (
                <ModalAddUserGroup
                    show={addRoleModal.isOpen}
                    handleClose={addRoleModal.close}
                    onAddRole={handleAddRole}
                />
            )}

            {assignModal.isOpen && selectedRole && (
                <ModalAssignFunction
                    show={assignModal.isOpen}
                    handleClose={assignModal.close}
                    role={selectedRole}
                />
            )}
        </div>
    );
};

export default DecentralizationTable;
