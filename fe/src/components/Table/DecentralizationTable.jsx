import '../../styles/Table.scss';
import TableHeaderAction from '../TableHeaderAction';
import { FaPuzzlePiece, FaSort } from 'react-icons/fa';
import ModalAssignFunction from '../Modal/ModalAssignFunction';
import ModalAddUserGroup from '../Modal/ModalAddUserGroup';
import useModal from '../../hooks/useModal';
import { useEffect, useState } from 'react';

//import mới 06/06/2025
import ReactPaginate from 'react-paginate';
import { fetchGroup , createGroup} from '../../services/roleServices'; // fetchGroup này dành cho admin

const DecentralizationTable = () => {
    const [userGroup, setUserGroup] = useState([
        { id: 1, TenNhomQuyen: 'Admin' },
        { id: 2, TenNhomQuyen: 'Giáo viên' },
        { id: 3, TenNhomQuyen: 'Học sinh' },
    ]);

    const addRoleModal = useModal();
    const assignModal = useModal();

    const [selectedGroup, setSelectedGroup] = useState(null);

    const fetchGroups = async () =>{
        let response = await fetchGroup();
        if (response && response.data && response.data.EC === 0) {
            setUserGroup(response.data.DT);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleAssignPermission = (group) => {
        setSelectedGroup(group);
        assignModal.open();
    };

    const handleAddRole = (newRole) => {
        setUserGroup((prev) => [...prev, { id: Date.now(), TenNhomQuyen: newRole }]);
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
                            <th>
                                Mô tả
                            </th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userGroup.length > 0 ? (
                            userGroup.map((group, index) => (
                                <tr key={`group-${index}`}>
                                    <td>{group.MaNhom}</td>
                                    <td>{group.TenNhom}</td>
                                    <td>{group.MoTa ? group.MoTa : "Chưa có mô tả "}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="icon-button assign"
                                                onClick={() => handleAssignPermission(group.MaNhom)}
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
                    fetchGroups = {fetchGroups}
                />
            )}

            {assignModal.isOpen && selectedGroup && (
                <ModalAssignFunction
                    show={assignModal.isOpen}
                    handleClose={assignModal.close}
                    group={selectedGroup}
                />
            )}
        </div>
    );
};

export default DecentralizationTable;
