import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { getFinalTestType } from '../../hooks/useSubjectGradeTable';

const ModalUpdateGrade = ({ show, handleClose, grade, onSave }) => {
    const [grade15min, setGrade15min] = useState('');
    const [grade1period, setGrade1period] = useState('');
    const [gradeFinal, setGradeFinal] = useState('');

    useEffect(() => {
        if (show && grade) {
            setGrade15min(
                grade.diemTP?.find(d => d.LoaiKiemTra === "Kiểm tra 15 phút")?.Diem ?? ''
            );
            setGrade1period(
                grade.diemTP?.find(d => d.LoaiKiemTra === "Kiểm tra 1 tiết")?.Diem ?? ''
            );
            setGradeFinal(
                grade.diemTP?.find(d => d.LoaiKiemTra === getFinalTestType(grade.semester || grade.TenHocKy))?.Diem ?? ''
            );
        }
    }, [show, grade]);

    const handleSave = () => {
        onSave({
            HoTen: grade.name,
            DiemTP: [
                { LoaiKiemTra: "Kiểm tra 15 phút", Diemmoi: grade15min },
                { LoaiKiemTra: "Kiểm tra 1 tiết", Diemmoi: grade1period },
                { LoaiKiemTra: "Thi học kỳ", Diemmoi: gradeFinal }
            ]
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
                <Button variant="primary" onClick={handleSave}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUpdateGrade;