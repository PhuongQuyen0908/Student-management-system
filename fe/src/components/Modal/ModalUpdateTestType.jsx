import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import _ from "lodash";

const ModalUpdateTestType = ({
    show,
    handleClose,
    testData,
    onSubmit,
}) => {
    const defaultDataForm = {
        testTypeName: testData?.TenLoaiKiemTra || "",
        coefficient: testData?.HeSo || "",
    };

    const defaultValidInput = {
        isValidTestTypeName: true,
        isValidCoefficient: true,
    };

    const [formData, setFormData] = useState(defaultDataForm);
    const [objValidInput, setObjValidInput] = useState(defaultValidInput);

    useEffect(() => {
        if (show && testData) {
            setFormData({
                testTypeName: testData.TenLoaiKiemTra || "",
                coefficient: testData.HeSo || "",
            });
            setObjValidInput(defaultValidInput);
        }
    }, [show, testData]);

    const handleOnChangeInput = (value, field) => {
        const updated = _.cloneDeep(formData);
        updated[field] = value;
        setFormData(updated);
    };

    const isValidInputs = () => {
        setObjValidInput(defaultValidInput);
        let isValid = true;

        if (!formData.testTypeName) {
            toast.error("Tên loại kiểm tra là bắt buộc.");
            setObjValidInput(prev => ({ ...prev, isValidTestTypeName: false }));
            isValid = false;
        }

        if (formData.coefficient === "" || isNaN(formData.coefficient) || +formData.coefficient <= 0) {
            toast.error("Hệ số phải là số lớn hơn 0.");
            setObjValidInput(prev => ({ ...prev, isValidCoefficient: false }));
            isValid = false;
        }

        return isValid;
    };

    const confirmUpdateTestType = async () => {
        if (!isValidInputs()) return;

        try {
            const response = await onSubmit({
                MaLoaiKiemTra: testData.MaLoaiKiemTra,
                TenLoaiKiemTra: formData.testTypeName,
                HeSo: Number(formData.coefficient),
            });

            if (response?.status === 200 && response?.data?.data) {
                handleClose();
                setFormData(defaultDataForm);
                setObjValidInput(defaultValidInput);
            } else {
                toast.error(response?.data?.message || "Không thể cập nhật loại kiểm tra");
            }
        } catch {
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sửa loại kiểm tra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="testTypeName" className="form-label">
                        Tên loại kiểm tra
                    </label>
                    <input
                        type="text"
                        className={
                            objValidInput.isValidTestTypeName
                                ? "form-control"
                                : "form-control is-invalid"
                        }
                        id="testTypeName"
                        placeholder="Ví dụ: Kiểm tra giữa kỳ"
                        value={formData.testTypeName}
                        onChange={(e) =>
                            handleOnChangeInput(e.target.value, "testTypeName")
                        }
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="coefficient" className="form-label">
                        Hệ số
                    </label>
                    <input
                        type="number"
                        className={
                            objValidInput.isValidCoefficient
                                ? "form-control"
                                : "form-control is-invalid"
                        }
                        id="coefficient"
                        placeholder="Ví dụ: 2"
                        value={formData.coefficient}
                        onChange={(e) =>
                            handleOnChangeInput(e.target.value, "coefficient")
                        }
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={confirmUpdateTestType}>
                    Sửa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUpdateTestType;
