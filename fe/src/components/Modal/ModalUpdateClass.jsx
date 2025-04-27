import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const ModalUpdateClass = ({ show, handleClose }) => {
    const [classId, setClassId] = useState("");
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

    const confirmUpdateClass = async () => {
        if (isValidInputs()) {
            toast.success("Cập nhật lớp học thành công");
            handleClose();
        }
    };

    useEffect(() => {
        if (show) {
            setClassId("");
            setClassName("");
            setClassGrade("10");
            setObjValidInput(defaultValidInput);
        }
    }, [show]);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sửa lớp học</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="classId" className="form-label">Mã lớp học</label>
                    <input
                        type="text"
                        className="form-control"
                        id="classId"
                        placeholder="Không được sửa"
                        disabled
                        value={classId}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="className" className="form-label">Tên lớp học</label>
                    <input
                        type="text"
                        className={objValidInput.isValidClassName ? "form-control" : "form-control is-invalid"}
                        id="className"
                        placeholder="Lớp 10A"
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
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={confirmUpdateClass}>
                    Sửa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUpdateClass;
