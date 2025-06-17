import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import _ from "lodash";

// Dữ liệu mặc định
const defaultGradeData = {
    GradeName: "", // Sửa từ TenKhoi → GradeName
};

const defaultValidInput = {
    isValidGradeName: true, // Sửa từ isValidTenKhoi → isValidGradeName
};

const ModalAddGradeClass = ({ show, handleClose, onSubmit, fetchGrades }) => {
    const [gradeData, setGradeData] = useState(defaultGradeData);
    const [objValidInput, setObjValidInput] = useState(defaultValidInput);

    useEffect(() => {
        if (show) {
            setGradeData(defaultGradeData);
            setObjValidInput(defaultValidInput);
        }
    }, [show]);

    const handleOnChangeInput = (value, field) => {
        let _gradeData = _.cloneDeep(gradeData);
        _gradeData[field] = value;
        setGradeData(_gradeData);
    };

    const isValidInputs = () => {
        setObjValidInput(defaultValidInput);
        let isValid = true;
        if (!gradeData.GradeName) {
            toast.error("Tên khối lớp là bắt buộc, không được để trống");
            setObjValidInput({ isValidGradeName: false });
            isValid = false;
        }
        return isValid;
    };

    const confirmAddGrade = async () => {
        let isValid = isValidInputs();
        if (!isValid) return;
        console.log("Grade gửi đi:", gradeData);
        try {
            const response = await onSubmit?.(gradeData);
            if (response?.data?.EC === 0) {
                await fetchGrades(); // Cập nhật danh sách khối lớp
                handleClose();
                setGradeData(defaultGradeData);
                setObjValidInput(defaultValidInput);
            } else if (response?.data?.EC === 1) {
                toast.error(response?.data?.EM || "Tên khối đã tồn tại");
                setObjValidInput({ isValidGradeName: false });
            }
        } catch (error) {
            console.log(error);
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm khối lớp</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="GradeName" className="form-label">
                        Tên khối lớp
                    </label>
                    <input
                        type="text"
                        className={
                            objValidInput.isValidGradeName
                                ? "form-control"
                                : "form-control is-invalid"
                        }
                        id="GradeName"
                        placeholder="Ví dụ: Khối 10"
                        value={gradeData.GradeName}
                        onChange={(event) =>
                            handleOnChangeInput(event.target.value, "GradeName")
                        }
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={confirmAddGrade}>
                    Thêm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAddGradeClass;
