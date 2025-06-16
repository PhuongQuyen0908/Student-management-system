import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
//import mới 
import { createGroup } from "../../services/roleServices";
const ModalAddUserGroup = ({ show, handleClose , fetchGroups}) => {
    const defaultGroupData = {
        TenNhom: "",
        MoTa: "",
    };

    const defaultValidInputs = {
        TenNhom: true,
        MoTa: true,
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

        if (!groupData.TenNhom.trim()) {
            toast.error("Tên nhóm không được để trống");
            setValidInputs((prev) => ({ ...prev, TenNhom: false }));
            isValid = false;
        }

        if (!groupData.MoTa.trim()) {
            toast.error("Mô tả nhóm không được để trống");
            setValidInputs((prev) => ({ ...prev, MoTa: false }));
            isValid = false;
        }

        return isValid;
    };

    const confirmAddGroup = async () => {
        const valid = isValidInputs();
        if (valid) {
            const response = await createGroup(groupData);
            if (response && +response.data.EC === 0) {
                toast.success(response.data.EM);
                await fetchGroups(); // Gọi hàm để cập nhật danh sách nhóm
                setGroupData(defaultGroupData);
                setValidInputs(defaultValidInputs);
                handleClose();
            } else {
                toast.error(response.data.EM);
            }
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
                            validInputs.TenNhom ? "form-control" : "form-control is-invalid"
                        }
                        value={groupData.TenNhom}
                        onChange={(e) => handleOnChangeInput(e.target.value, "TenNhom")}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                        className={
                            validInputs.MoTa ? "form-control" : "form-control is-invalid"
                        }
                        value={groupData.MoTa}
                        onChange={(e) => handleOnChangeInput(e.target.value, "MoTa")}
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
