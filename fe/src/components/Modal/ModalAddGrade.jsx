import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ModalAddGrade = ({ show, handleClose }) => {
    const [grade15min, setGrade15min] = useState('');
    const [grade1period, setGrade1period] = useState('');
    const [gradeFinal, setGradeFinal] = useState('');

    useEffect(() => {
        if (show) {
            setGrade15min('');
            setGrade1period('');
            setGradeFinal('');
        }
    }, [show]);

    const handleAdd = () => {
        // Gửi dữ liệu tại đây
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm điểm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Điểm 15 phút</label>
                    <input
                        type="number"
                        className="form-control"
                        value={grade15min}
                        onChange={(e) => setGrade15min(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Điểm 1 tiết</label>
                    <input
                        type="number"
                        className="form-control"
                        value={grade1period}
                        onChange={(e) => setGrade1period(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Điểm học kỳ</label>
                    <input
                        type="number"
                        className="form-control"
                        value={gradeFinal}
                        onChange={(e) => setGradeFinal(e.target.value)}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleAdd}>
                    Thêm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAddGrade;
