import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const allPermissions = [
    "/user/create",
    "/user/read",
    "/user/update",
    "/user/delete",
    "/group/read",
    "/role/create",
    "/role/read",
    "/role/update",
    "/role/delete",
    "/role/by-group",
    "/role/assign-to-group",
];

const ModalAssignFunction = ({ show, handleClose, role }) => {
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        if (role) {
            // giả lập dữ liệu quyền đã được gán
            setSelectedPermissions([
                "/user/read",
                "/user/update",
                "/group/read",
                "/role/read",
            ]);
        }
    }, [role]);

    const handleTogglePermission = (permission) => {
        setSelectedPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((item) => item !== permission)
                : [...prev, permission]
        );
    };

    const handleSave = () => {
        console.log(`Gán quyền cho nhóm "${role?.TenNhomQuyen}":`, selectedPermissions);
        toast.success("Đã lưu quyền chức năng!");
        handleClose();
    };

    if (!role) return null;

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Gán chức năng cho nhóm: <strong>{role.TenNhomQuyen}</strong>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Assign Roles:</h5>
                <div className="d-flex flex-column gap-2 ps-2">
                    {allPermissions.map((permission) => (
                        <label key={permission} className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedPermissions.includes(permission)}
                                onChange={() => handleTogglePermission(permission)}
                            />
                            <span className="form-check-label">{permission}</span>
                        </label>
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
