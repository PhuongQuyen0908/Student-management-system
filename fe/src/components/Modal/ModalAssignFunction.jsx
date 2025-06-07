import { useState, useEffect, use } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

import { fetchAllPermissions ,  fetchAllPermissionsByGroup ,assignGroupPermissions} from "../../services/roleServices";
import '../../styles/ModalAssignFunction.scss'; // Import CSS styles for the modal
import _, { set } from "lodash";


const ModalAssignFunction = ({ show, handleClose, MaNhom , TenNhom }) => {
    const [permissions, setPermissions] = useState([]);
    const [groupedPermissions, setGroupedPermissions] = useState({});
    const [assignRolesByGroup, setAssignRolesByGroup] = useState([]);



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
    },[permissions]);

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
        if(index > -1) {
            _assignRolesByGroup[index].isAssigned = !_assignRolesByGroup[index].isAssigned;
        }
        setAssignRolesByGroup(_assignRolesByGroup);
    };

    const buildDataPermissionToSave = () =>{
        let data = {}
        data.MaNhom = +MaNhom;
        data.DanhSachQuyen = assignRolesByGroup.filter(item => item.isAssigned).map(item => {
            return {
                MaNhom : +MaNhom,
                MaChucNang: item.MaChucNang,
            }
        });
        // data = = {MaNhom:1 , NhomChucNang: [{MaChucNang: 1, TenManHinhDuocLoad: 'abc'}, ...]}
        return data;

    }

    const handleSave = async () => {
        let data =  buildDataPermissionToSave();
        const res =  await assignGroupPermissions(data);
        if (res.data && res.data.EC === 0 ){
            toast.success(res.data.EM || "Đã lưu quyền chức năng!");
            handleClose();

        }else{
            toast.error(res.data.EM || "Lỗi khi lưu quyền chức năng!");
        }
       
    };


    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Gán chức năng cho nhóm: <strong>{TenNhom}</strong>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Assign Roles:</h5>
                <div className="permission-grid roleContainer">
                    {Object.entries(groupedPermissions).map(([groupName, perms]) => (
                        <div key={`group-${groupName}`} className="mb-3 ">
                            <h6 className="text-primary">{groupName}</h6> {/* Hiển thị tên nhóm chức năng */}
                            <div className="permission-container ">
                                {perms.map(permission => (
                                    <label key={permission.MaChucNang} className="form-check permission-item">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={permission.isAssigned}
                                            disabled ={MaNhom ===1}
                                            onChange={() => handleTogglePermission(permission.MaChucNang)}
                                        />
                                        <span className="form-check-label">{permission.TenChucNang}</span>
                                    </label>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="warning" onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAssignFunction;
