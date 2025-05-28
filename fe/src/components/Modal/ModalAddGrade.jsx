import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ModalAddGrade = ({ show, handleClose, onAdd, student, context, testTypes }) => {
    const [grades, setGrades] = useState({});

    useEffect(() => {
        if (show) setGrades({});
    }, [show]);

    const handleChange = (type, value) => {
        setGrades(prev => ({ ...prev, [type]: value }));
    };

    const handleAdd = () => {
        onAdd({
            HoTen: student?.name,
            TenLop: context?.class,
            TenMonHoc: context?.subject,
            TenHocKy: context?.semester,
            TenNamHoc: context?.year,
            DiemTP: {...grades}
        });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm điểm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Họ và tên học sinh</label>
                    <input
                        type="text"
                        className="form-control"
                        value={student?.name || ''}
                        disabled
                    />
                </div>
                {testTypes.map(type => (
                    <div className="mb-3" key={type.MaLoaiKiemTra}>
                        <label className="form-label">{type.TenLoaiKiemTra}</label>
                        <input
                            type="number"
                            className="form-control"
                            value={grades[type.TenLoaiKiemTra] || ""}
                            onChange={e => handleChange(type.TenLoaiKiemTra, e.target.value)}
                        />
                    </div>
                ))}
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