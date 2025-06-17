import '../../styles/Table.scss';
import TableHeaderAction from '../TableHeaderAction';
import { FaPuzzlePiece, FaSort, FaTrash } from 'react-icons/fa';
import ModalAssignFunction from '../Modal/ModalAssignFunction';
import ModalAddUserGroup from '../Modal/ModalAddUserGroup';
import useModal from '../../hooks/useModal';
import { useEffect, useState } from 'react';

//import mới 06/06/2025
import ReactPaginate from 'react-paginate';
import { fetchGroup, createGroup } from '../../services/roleServices'; // fetchGroup này dành cho admin
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { set } from 'lodash';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { deleteGroup } from '../../services/userServices';

import ModalDeleteGroup from '../Modal/ModalDeleteGroup';


const DecentralizationTable = () => {
    const { user } = useContext(UserContext);
    const userPermissions = user?.account?.groupWithPermissions?.chucnangs || [];

    // Kiểm tra quyền từ userPermissions
    const canCreate = userPermissions.some(p => p.TenManHinhDuocLoad === "/group/create");
    const canReadPermission = userPermissions.some(p => p.TenManHinhDuocLoad === "/permission/read");
    const canAssignPermission = userPermissions.some(p => p.TenManHinhDuocLoad === "/permission/assign");
    const canDelete = userPermissions.some(p => p.TenManHinhDuocLoad === "/group/delete");

    const [userGroup, setUserGroup] = useState([]);

    const addRoleModal = useModal();
    const assignModal = useModal();
    const deleteModal = useModal();

    const [selectedGroup, setSelectedGroup] = useState(null);
    //Tìm kiếm nhóm quyền
    const [searchTerm, setSearchTerm] = useState("");

    //sort
    const [sortField, setSortField] = useState("MaNhom");
    const [sortOrder, setSortOrder] = useState("asc");

    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };



    const fetchGroups = async () => {
        let response = await fetchGroup(searchTerm, sortField, sortOrder);
        if (response && response.data && response.data.EC === 0) {
            setUserGroup(response.data.DT);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, [searchTerm, sortField, sortOrder]);
    //gán quyền
    const handleAssignPermission = (group) => {
        setSelectedGroup(group);
        assignModal.open();
    };

    //thêm nhóm quyền
    const handleAddRole = (newRole) => {
        setUserGroup((prev) => [...prev, { id: Date.now(), TenNhomQuyen: newRole }]);
        addRoleModal.close();
    };

    const handleDeleteGroup = (MaNhom) => {
        setSelectedGroup(MaNhom);
        deleteModal.open();
    };
    //hàm highlightText để làm nổi bật từ khóa tìm kiếm trong bảng
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

    const exportToExcel = () => {
        try {
            if (!userGroup || userGroup.length === 0) {
                toast.warning("Không có dữ liệu để xuất Excel");
                return;
            }

            const data = userGroup.map(group => ({
                'Mã nhóm': group.MaNhom,
                'Tên nhóm quyền': group.TenNhom,
                'Mô tả': group.MoTa || 'Chưa có mô tả',
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách nhóm quyền');

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const file = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            saveAs(file, `DanhSachNhomQuyen.xlsx`);
            toast.success("Xuất Excel thành công.");
        } catch (error) {
            console.error("Error exporting groups to Excel:", error);
            toast.error("Lỗi khi xuất file Excel");
        }
    };


    const confirmDeleteGroup = async (MaNhom) => {
        try {
            const response = await deleteGroup(MaNhom);
            if (response && response.data && response.data.EC === 0) {
                toast.success("Xóa nhóm thành công");
            } else {
                toast.error(response.data.EM || "Xóa nhóm thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi xóa nhóm:", error);
            toast.error(response.data.EM || "Lỗi trong quá trình xóa nhóm");
        }
        deleteModal.close(); // Đóng modal sau khi xóa
        fetchGroups(); // Cập nhật lại danh sách nhóm sau khi xóa
    }

    return (
        <div className="student-table-wrapper">
            <TableHeaderAction
                onAddClick={addRoleModal.open}
                onSearchChange={(e) => { setSearchTerm(e.target.value) }}
                placeholder="Tìm kiếm nhóm quyền..."
                addLabel="Thêm nhóm quyền"
                hideAdd={!canCreate}
                onExportClick={exportToExcel}
            />

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mã Nhóm
                                <button className="sort-button" title="Sắp xếp" onClick={() => handleSort("MaNhom")}>
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Tên nhóm quyền
                                <button className="sort-button" title="Sắp xếp" onClick={() => handleSort("TenNhom")}>
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
                                    <td>{highlightText(group.MaNhom, searchTerm)}</td>
                                    <td>{highlightText(group.TenNhom, searchTerm)}</td>
                                    <td>{highlightText(group.MoTa ? group.MoTa : "Chưa có mô tả ", searchTerm)}</td>
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
                                            {canDelete && (
                                                <button className="icon-button lock"
                                                    onClick={() => handleDeleteGroup(group.MaNhom)} title="Xóa">
                                                    <FaTrash />

                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Không tìm thấy nhóm quyền</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {
                deleteModal.isOpen && selectedGroup && (
                    <ModalDeleteGroup
                        show={deleteModal.isOpen}
                        handleClose={deleteModal.close}
                        MaNhom={selectedGroup}
                        fetchGroups={fetchGroups}
                        confirmDeleteGroup={confirmDeleteGroup}

                    />
                )
            }

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
