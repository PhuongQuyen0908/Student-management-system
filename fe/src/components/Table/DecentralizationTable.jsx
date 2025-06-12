import '../../styles/Table.scss';
import TableHeaderAction from '../TableHeaderAction';
import { FaPuzzlePiece, FaSort } from 'react-icons/fa';
import ModalAssignFunction from '../Modal/ModalAssignFunction';
import ModalAddUserGroup from '../Modal/ModalAddUserGroup';
import useModal from '../../hooks/useModal';
import { useEffect, useState } from 'react';

//import mới 06/06/2025
import ReactPaginate from 'react-paginate';
import { fetchGroup, createGroup } from '../../services/roleServices'; // fetchGroup này dành cho admin
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const DecentralizationTable = () => {
    const { user } = useContext(UserContext);
    const userPermissions = user?.account?.groupWithPermissions?.chucnangs || [];

    // Kiểm tra quyền từ userPermissions
    const canCreate = userPermissions.some(p => p.TenManHinhDuocLoad === "/group/create");
    const canReadPermission = userPermissions.some(p => p.TenManHinhDuocLoad === "/permission/read");
    const canAssignPermission = userPermissions.some(p => p.TenManHinhDuocLoad === "/permission/assign");

    const [userGroup, setUserGroup] = useState([]);

    const addRoleModal = useModal();
    const assignModal = useModal();

    const [selectedGroup, setSelectedGroup] = useState(null);

    const fetchGroups = async () => {
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
                                Tên nhóm quyền
                                <button className="sort-button" title="Sắp xếp">
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Mô tả
                            </th>
                            <th></th>
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
                                            {canReadPermission && (
                                                <button
                                                    className="icon-button assign"
                                                    onClick={() => handleAssignPermission(group.MaNhom)}
                                                    title="Gán chức năng"
                                                >
                                                    <FaPuzzlePiece />
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



            {addRoleModal.isOpen && (
                <ModalAddUserGroup
                    show={addRoleModal.isOpen}
                    handleClose={addRoleModal.close}
                    onAddRole={handleAddRole}
                    fetchGroups={fetchGroups}
                />
            )}

            {assignModal.isOpen && selectedGroup && (
                <ModalAssignFunction
                    show={assignModal.isOpen}
                    handleClose={assignModal.close}
                    MaNhom={selectedGroup}
                    TenNhom={userGroup.find(group => group.MaNhom === selectedGroup)?.TenNhom || ''}
                />
            )}
        </div>
    );
};

export default DecentralizationTable;
