import { useState, useEffect, use } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

import { fetchAllPermissions, fetchAllPermissionsByGroup, assignGroupPermissions } from "../../services/roleServices";
import '../../styles/ModalAssignFunction.scss'; // Import CSS styles for the modal
import _, { set } from "lodash";

import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";


const ModalAssignFunction = ({ show, handleClose, MaNhom, TenNhom }) => {
    const [permissions, setPermissions] = useState([]);
    const [groupedPermissions, setGroupedPermissions] = useState({});
    const [assignRolesByGroup, setAssignRolesByGroup] = useState([]);
    const { user } = useContext(UserContext);
    const userPermissions = user?.account?.groupWithPermissions?.chucnangs || [];
    const [searchTerm, setSearchTerm] = useState('');

    // Kiểm tra quyền từ userPermissions
    const canAssign = userPermissions.some(p => p.TenManHinhDuocLoad === "/permission/assign");


    const fetchPermissions = async () => {
        try {
            const response = await fetchAllPermissions();
            if (response && response.data.EC === 0) {
                setPermissions(response.data.DT);

            } else {
                toast.error(response.data.EM || "Lỗi khi lấy danh sách quyền");
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách quyền:", error);
            toast.error("Lỗi kết nối đến máy chủ");
        }
    }


    const buildDataPermissionByGroup = (groupPermissions, permissions) => {
        let result = [];
        if (permissions && permissions.length > 0) {
            permissions.map(permission => {
                let object = {};
                object.MaChucNang = permission.MaChucNang;
                object.TenManHinhDuocLoad = permission.TenManHinhDuocLoad;
                object.TenChucNang = permission.TenChucNang;
                object.NhomChucNang = permission.NhomChucNang;
                object.isAssigned = false;
                if (groupPermissions && groupPermissions.length > 0) {
                    object.isAssigned = groupPermissions.some(item => item.TenManHinhDuocLoad === object.TenManHinhDuocLoad); //hàm some trả về true hay false
                }
                result.push(object)
            })
        }
        return result;
    }

    const fetchPermissionsByGroup = async (MaNhom) => {
        try {
            const response = await fetchAllPermissionsByGroup(+MaNhom);
            let data = response.data.DT
            if (response && +response.data.EC === 0) {
                let result = buildDataPermissionByGroup(data.chucnangs, permissions);
                setAssignRolesByGroup(result);
            } else {
                toast.error(response.data.EM || "Lỗi khi lấy danh sách quyền của nhóm");
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách quyền của nhóm:", error);
            toast.error("Lỗi kết nối đến máy chủ");
        }
    }
    useEffect(() => {
        fetchPermissions();

    }, []);

    useEffect(() => {
        fetchPermissionsByGroup(MaNhom);
    }, [permissions]);

    useEffect(() => {
        //Group từng quyền theo nhóm
        const grouped = assignRolesByGroup.reduce((acc, permission) => {
            const NhomChucNang = permission.NhomChucNang || 'Khác';
            if (!acc[NhomChucNang]) acc[NhomChucNang] = [];
            acc[NhomChucNang].push(permission);
            return acc;
        }, {});
        setGroupedPermissions(grouped);
    }, [assignRolesByGroup]);

    const handleTogglePermission = (MaChucNang) => {
        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
        const index = _assignRolesByGroup.findIndex(item => item.MaChucNang === MaChucNang);
        if (index > -1) {
            _assignRolesByGroup[index].isAssigned = !_assignRolesByGroup[index].isAssigned;
        }
        setAssignRolesByGroup(_assignRolesByGroup);
    };

    const buildDataPermissionToSave = () => {
        let data = {}
        data.MaNhom = +MaNhom;
        data.DanhSachQuyen = assignRolesByGroup.filter(item => item.isAssigned).map(item => {
            return {
                MaNhom: +MaNhom,
                MaChucNang: item.MaChucNang,
            }
        });
        // data = = {MaNhom:1 , NhomChucNang: [{MaChucNang: 1, TenManHinhDuocLoad: 'abc'}, ...]}
        return data;

    }

    const handleSave = async () => {
        if (!canAssign) {
            toast.warning("Bạn không có quyền gán quyền cho nhóm người dùng.");
            return;
        }

        let data = buildDataPermissionToSave();
        const res = await assignGroupPermissions(data);
        if (res.data && res.data.EC === 0) {
            toast.success(res.data.EM || "Đã lưu quyền chức năng!");
            handleClose();

        } else {
            toast.error(res.data.EM || "Lỗi khi lưu quyền chức năng!");
        }

    };

    const handleSelectAllInGroup = (groupName) => {
        const isAllSelected = allSelected(groupName);
        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
        
        _assignRolesByGroup.forEach(item => {
            if (item.NhomChucNang === groupName && MaNhom !== 1) {
            item.isAssigned = !isAllSelected;
            }
        });
        
        setAssignRolesByGroup(_assignRolesByGroup);
    };

    const allSelected = (groupName) => {
        const groupPerms = assignRolesByGroup.filter(p => p.NhomChucNang === groupName);
        return groupPerms.every(p => p.isAssigned);
    };

    const getFilteredPermissions = () => {
        if (!searchTerm.trim()) return groupedPermissions;
        
        const filtered = {};
        
        Object.entries(groupedPermissions).forEach(([groupName, perms]) => {
            const matchedPerms = perms.filter(p => 
            p.TenChucNang.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (matchedPerms.length > 0) {
            filtered[groupName] = matchedPerms;
            }
        });
        
        return filtered;
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Gán chức năng cho nhóm: <strong>{TenNhom}</strong>
                </Modal.Title>
            </Modal.Header>
        <Modal.Body>
            <div className="search-container mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Tìm kiếm chức năng..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="permission-grid">
                {Object.entries(getFilteredPermissions()).map(([groupName, perms]) => (
                    <div key={`group-${groupName}`} className="permission-card mb-3">
                        <div className="permission-card-header">
                            <h6>{groupName}</h6>
                            {MaNhom !== 1 && (
                                <button 
                                    className="btn-select-all" 
                                    onClick={() => handleSelectAllInGroup(groupName)}
                                >
                                    {allSelected(groupName) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                                </button>
                            )}
                        </div>
                        <div className="permission-container">
                            {perms.map(permission => (
                                <label key={permission.MaChucNang} className="permission-item">
                                    <input
                                        type="checkbox"
                                        checked={permission.isAssigned}
                                        disabled={MaNhom === 1}
                                        onChange={() => handleTogglePermission(permission.MaChucNang)}
                                    />
                                    <span>{permission.TenChucNang}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSave}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAssignFunction;
