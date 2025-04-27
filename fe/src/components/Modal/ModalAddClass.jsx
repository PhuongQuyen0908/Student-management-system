import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ModalAddClass = ({ show, handleClose }) => {
    const [className, setClassName] = useState("");
    const [classGrade, setClassGrade] = useState("10");

    const defaultValidInput = {
        isValidClassName: true,
        isValidClassGrade: true,
    };

    const [objValidInput, setObjValidInput] = useState(defaultValidInput);

    const isValidInputs = () => {
        setObjValidInput(defaultValidInput);

        if (!className) {
            toast.error("Tên lớp học là bắt buộc");
            setObjValidInput({ ...defaultValidInput, isValidClassName: false });
            return false;
        }

        if (!classGrade) {
            toast.error("Khối lớp là bắt buộc");
            setObjValidInput({ ...defaultValidInput, isValidClassGrade: false });
            return false;
        }

        return true;
    };

    const confirmAddClass = () => {
        const isValid = isValidInputs();
        if (isValid) {
            toast.success("Thêm lớp học thành công");
            handleClose();

            // Reset form
            setClassName("");
            setClassGrade("10");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm lớp học</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="className" className="form-label">Tên lớp học</label>
                    <input
                        type="text"
                        className={objValidInput.isValidClassName ? "form-control" : "form-control is-invalid"}
                        id="className"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="classGrade" className="form-label">Khối lớp</label>
                    <select
                        className={objValidInput.isValidClassGrade ? "form-control" : "form-control is-invalid"}
                        id="classGrade"
                        value={classGrade}
                        onChange={(e) => setClassGrade(e.target.value)}
                    >
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                <Button variant="primary" onClick={confirmAddClass}>Thêm</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAddClass;
