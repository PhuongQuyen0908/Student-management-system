import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalAddUserGroup = ({ show, handleClose }) => {
    const defaultGroupData = {
        name: "",
        description: "",
    };

    const defaultValidInputs = {
        name: true,
        description: true,
    };

    const [groupData, setGroupData] = useState(defaultGroupData);
    const [validInputs, setValidInputs] = useState(defaultValidInputs);

    const handleOnChangeInput = (value, field) => {
        setGroupData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const isValidInputs = () => {
        let isValid = true;
        setValidInputs(defaultValidInputs);

        if (!groupData.name.trim()) {
            toast.error("Tên nhóm không được để trống");
            setValidInputs((prev) => ({ ...prev, name: false }));
            isValid = false;
        }

        if (!groupData.description.trim()) {
            toast.error("Mô tả nhóm không được để trống");
            setValidInputs((prev) => ({ ...prev, description: false }));
            isValid = false;
        }

        return isValid;
    };

    const confirmAddGroup = async () => {
        const valid = isValidInputs();
        if (valid) {
            console.log("Tạo nhóm người dùng thành công với dữ liệu:", groupData);
            toast.success("Tạo nhóm người dùng thành công!");

            setGroupData(defaultGroupData);
            setValidInputs(defaultValidInputs);
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm nhóm người dùng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Tên nhóm</label>
                    <input
                        type="text"
                        className={
                            validInputs.name ? "form-control" : "form-control is-invalid"
                        }
                        value={groupData.name}
                        onChange={(e) => handleOnChangeInput(e.target.value, "name")}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                        className={
                            validInputs.description ? "form-control" : "form-control is-invalid"
                        }
                        value={groupData.description}
                        onChange={(e) => handleOnChangeInput(e.target.value, "description")}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={confirmAddGroup}>
                    Thêm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAddUserGroup;
