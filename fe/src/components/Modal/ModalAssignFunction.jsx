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
    "/group/create",
    "/group/read",
    "/group/update",
    "/group/delete",
    "/group/by-group",
    "/group/assign-to-group",
];

const ModalAssignFunction = ({ show, handleClose, group }) => {
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        if (group) {
            // giả lập dữ liệu quyền đã được gán
            setSelectedPermissions([
                "/user/read",
                "/user/update",
                "/group/read",
                "/group/read",
            ]);
        }
    }, [group]);

    const handleTogglePermission = (permission) => {
        setSelectedPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((item) => item !== permission)
                : [...prev, permission]
        );
    };

    const handleSave = () => {
        console.log(`Gán quyền cho nhóm "${group?.TenNhomQuyen}":`, selectedPermissions);
        toast.success("Đã lưu quyền chức năng!");
        handleClose();
    };

    if (!group) return null;

    return (
        <Modal show={show} onHide={handleClose} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>
                    Gán chức năng cho nhóm: <strong>{group.TenNhomQuyen}</strong>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Assign Roles:</h5>
                <div className="d-flex flex-column gap-2 ps-2">
                    {allPermissions.map((permission , index) => (
                        <label key={`permission-${index}`} className="form-check">
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
