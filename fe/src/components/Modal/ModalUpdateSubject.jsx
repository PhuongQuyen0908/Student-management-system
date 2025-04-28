import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const ModalUpdateSubject = ({ show, handleClose }) => {
    const [subjectCode, setSubjectCode] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const [passingScore, setPassingScore] = useState('');
    const [coefficient, setCoefficient] = useState('');

    const defaultValidInput = {
        isValidSubjectName: true,
        isValidPassingScore: true,
        isValidCoefficient: true,
    };

    const [objValidInput, setObjValidInput] = useState(defaultValidInput);

    const isValidInputs = () => {
        setObjValidInput(defaultValidInput);

        if (!subjectName) {
            toast.error("Tên môn học là bắt buộc");
            setObjValidInput({ ...defaultValidInput, isValidSubjectName: false });
            return false;
        }

        if (!passingScore) {
            toast.error("Số điểm đạt là bắt buộc");
            setObjValidInput({ ...defaultValidInput, isValidPassingScore: false });
            return false;
        }

        if (!coefficient) {
            toast.error("Hệ số là bắt buộc");
            setObjValidInput({ ...defaultValidInput, isValidCoefficient: false });
            return false;
        }

        return true;
    };

    const confirmUpdateSubject = async () => {
        if (isValidInputs()) {
            toast.success("Cập nhật môn học thành công");
            handleClose();
        }
    };

    useEffect(() => {
        if (show) {
            // Reset fields when modal opens
            setSubjectCode('');
            setSubjectName('');
            setPassingScore('');
            setCoefficient('');
            setObjValidInput(defaultValidInput);
        }
    }, [show]);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sửa môn học</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="subjectCode" className="form-label">Mã môn học</label>
                    <input
                        type="text"
                        className="form-control"
                        id="subjectCode"
                        placeholder="Không thể sửa"
                        disabled
                        value={subjectCode}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="subjectName" className="form-label">Tên môn học</label>
                    <input
                        type="text"
                        className={objValidInput.isValidSubjectName ? "form-control" : "form-control is-invalid"}
                        id="subjectName"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="passingScore" className="form-label">Số điểm đạt</label>
                    <input
                        type="number"
                        className={objValidInput.isValidPassingScore ? "form-control" : "form-control is-invalid"}
                        id="passingScore"
                        value={passingScore}
                        onChange={(e) => setPassingScore(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="coefficient" className="form-label">Hệ số</label>
                    <input
                        type="number"
                        className={objValidInput.isValidCoefficient ? "form-control" : "form-control is-invalid"}
                        id="coefficient"
                        value={coefficient}
                        onChange={(e) => setCoefficient(e.target.value)}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={confirmUpdateSubject}>
                    Sửa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUpdateSubject;