import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ModalUpdateGrade = ({ show, handleClose, grade, onSave, testTypes }) => {
    const [grades, setGrades] = useState({});

    useEffect(() => {
        if (show && grade) {
            const initial = {};
            testTypes.forEach(type => {
                initial[type.TenLoaiKiemTra] =
                    grade.diemTP?.find(d => d.LoaiKiemTra === type.TenLoaiKiemTra)?.Diem ?? '';
            });
            setGrades(initial);
        }
    }, [show, grade, testTypes]);

    const handleChange = (type, value) => {
        setGrades(prev => ({ ...prev, [type]: value }));
    };

    const handleSave = () => {
        const filledScores = testTypes
            .filter(type => grades[type.TenLoaiKiemTra] !== "" && grades[type.TenLoaiKiemTra] !== null && grades[type.TenLoaiKiemTra] !== undefined)
            .map(type => ({
                LoaiKiemTra: type.TenLoaiKiemTra,
                Diemmoi: grades[type.TenLoaiKiemTra]
            }));
        onSave({
            HoTen: grade.name,
            DiemTP: filledScores
        });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa điểm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Họ và tên học sinh</label>
                    <input
                        type="text"
                        className="form-control"
                        value={grade?.name || ''}
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
                <Button variant="primary" onClick={handleSave}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUpdateGrade;