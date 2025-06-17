import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import _ from "lodash";

const ModalUpdateGradeClass = ({
    show,
    handleClose,
    gradeData,
    onSubmit,
}) => {
    const defaultDataForm = {
        gradeName: gradeData?.TenKhoi || "",
    };

    const defaultValidInput = {
        isValidGradeName: true,
    };

    const [formData, setFormData] = useState(defaultDataForm);
    const [objValidInput, setObjValidInput] = useState(defaultValidInput);

    useEffect(() => {
        if (show && gradeData) {
            setFormData({
                gradeName: gradeData.TenKhoi || "",
            });
            setObjValidInput(defaultValidInput);
        }
    }, [show, gradeData]);

    const handleOnChangeInput = (value, field) => {
        const updated = _.cloneDeep(formData);
        updated[field] = value;
        setFormData(updated);
    };

    const isValidInputs = () => {
        setObjValidInput(defaultValidInput);
        let isValid = true;
        if (!formData.gradeName) {
            toast.error("Tên khối lớp là bắt buộc, không được để trống");
            setObjValidInput((prev) => ({ ...prev, isValidGradeName: false }));
            isValid = false;
        }
        return isValid;
    };

    const confirmUpdateGrade = async () => {
        let isValid = isValidInputs();
        if (!isValid) return;

        try {
            const response = await onSubmit({
                MaKhoi: gradeData.MaKhoi,
                TenKhoi: formData.gradeName,
            });
            if (response?.data?.EC === 0) {
                handleClose();
                setFormData(defaultDataForm);
                setObjValidInput(defaultValidInput);
            }
        } catch {
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sửa khối lớp</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="gradeName" className="form-label">
                        Tên khối lớp
                    </label>
                    <input
                        type="text"
                        className={
                            objValidInput.isValidGradeName
                                ? "form-control"
                                : "form-control is-invalid"
                        }
                        id="gradeName"
                        placeholder="Ví dụ: Khối 10"
                        value={formData.gradeName}
                        onChange={(e) => handleOnChangeInput(e.target.value, "gradeName")}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={confirmUpdateGrade}>
                    Sửa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUpdateGradeClass;
