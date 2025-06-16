import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

const ModalAddTestType = ({ show, handleClose, onSubmit }) => {
    const [testType, setTestType] = useState({
        TenLoaiKiemTra: '',
        HeSo: 1
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTestType(prev => ({
            ...prev,
            [name]: name === 'HeSo' ? Number(value) : value
        }));
    };

    const handleSubmit = async () => {
        if (!testType.TenLoaiKiemTra.trim()) {
            toast.error("Tên loại kiểm tra không được để trống");
            return;
        }
        
        if (testType.HeSo <= 0) {
            toast.error("Hệ số phải lớn hơn 0");
            return;
        }
        
        await onSubmit(testType);
        handleClose();
        
        // Reset form
        setTestType({
            TenLoaiKiemTra: '',
            HeSo: 1
        });
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm loại kiểm tra mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Tên loại kiểm tra</label>
                    <input
                        type="text"
                        className="form-control"
                        name="TenLoaiKiemTra"
                        value={testType.TenLoaiKiemTra}
                        onChange={handleChange}
                        placeholder="Ví dụ: Kiểm tra 15 phút, Kiểm tra giữa kỳ..."
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Hệ số</label>
                    <input
                        type="number"
                        className="form-control"
                        name="HeSo"
                        value={testType.HeSo}
                        onChange={handleChange}
                        min="1"
                        step="1"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Thêm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAddTestType;