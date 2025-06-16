import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ModalDeleteScore = ({ show, handleClose, student, testTypes, context, onDelete }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    if (show) setSelectedTypes([]);
  }, [show, student]);

  const handleCheckboxChange = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSelectAll = () => {
    const availableTypes = testTypes.filter(
      type => student.diemTP?.find(d => d.LoaiKiemTra === type.TenLoaiKiemTra)
    ).map(type => type.TenLoaiKiemTra);

    if (selectedTypes.length === availableTypes.length) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(availableTypes);
    }
  };

  const handleDelete = async () => {
    if (selectedTypes.length === 0) return;
    await onDelete({
      MaHocSinh: student.id,
      TenLop: context.class,
      TenMonHoc: context.subject,
      TenHocKy: context.semester,
      TenNamHoc: context.year,
      DiemTP: selectedTypes.map(typeName => ({
        LoaiKiemTra: typeName,
        Diem: student.diemTP?.find(d => d.LoaiKiemTra === typeName)?.Diem
      }))
    });
    handleClose();
  };

  // Only allow selection for scores that exist
  const availableTypes = testTypes.filter(
    type => student.diemTP?.find(d => d.LoaiKiemTra === type.TenLoaiKiemTra)
  );

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xóa điểm</Modal.Title>
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
        <div className="mb-3">
          <label className="form-label">Chọn loại điểm muốn xóa:</label>
          <div>
            <Button
              size="sm"
              variant={selectedTypes.length === availableTypes.length ? "secondary" : "outline-secondary"}
              onClick={handleSelectAll}
              className="mb-2"
            >
              {selectedTypes.length === availableTypes.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </Button>
          </div>
          {testTypes.map(type => {
            const exists = student.diemTP?.find(d => d.LoaiKiemTra === type.TenLoaiKiemTra);
            return (
              <div key={type.MaLoaiKiemTra} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`delete-score-${type.MaLoaiKiemTra}`}
                  checked={selectedTypes.includes(type.TenLoaiKiemTra)}
                  onChange={() => handleCheckboxChange(type.TenLoaiKiemTra)}
                  disabled={!exists}
                />
                <label className="form-check-label" htmlFor={`delete-score-${type.MaLoaiKiemTra}`}>
                  {type.TenLoaiKiemTra} (
                  {exists?.Diem ?? 'Chưa có'}
                  )
                </label>
              </div>
            );
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={selectedTypes.length === 0}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteScore;