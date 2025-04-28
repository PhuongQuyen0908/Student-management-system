import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ModalAddSubject = ({ show, handleClose }) => {
    const [subjectCode, setSubjectCode] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const [passingScore, setPassingScore] = useState('');
    const [coefficient, setCoefficient] = useState('');

    const defaultValidInput = {
        isValidSubjectCode: true,
        isValidSubjectName: true,
        isValidPassingScore: true,
        isValidCoefficient: true,
    };

    const [objValidInput, setObjValidInput] = useState(defaultValidInput);

    const isValidInputs = () => {
        setObjValidInput(defaultValidInput);

        if (!subjectCode) {
            toast.error("Mã môn học là bắt buộc");
            setObjValidInput({ ...defaultValidInput, isValidSubjectCode: false });
            return false;
        }

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

    const confirmAddSubject = () => {
        const isValid = isValidInputs();
        if (isValid) {
            toast.success("Thêm môn học thành công");
            handleClose();

            // Reset form
            setSubjectCode('');
            setSubjectName('');
            setPassingScore('');
            setCoefficient('');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm môn học</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="subjectCode" className="form-label">Mã môn học</label>
                    <input
                        type="text"
                        className={objValidInput.isValidSubjectCode ? "form-control" : "form-control is-invalid"}
                        id="subjectCode"
                        value={subjectCode}
                        onChange={(e) => setSubjectCode(e.target.value)}
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
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                <Button variant="primary" onClick={confirmAddSubject}>Thêm</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAddSubject;
