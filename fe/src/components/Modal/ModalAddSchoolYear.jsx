import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

const ModalAddSchoolYear = (props) => {
  const { show, handleClose, confirmAddSchoolYear } = props;

  const [schoolYear, setSchoolYear] = useState({
    TenNamHoc: '',
    Nam1: '',
    Nam2: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSchoolYear({
      ...schoolYear,
      [name]: value
    });

    // Automatically calculate the years when TenNamHoc changes
    if (name === 'TenNamHoc') {
      const years = value.split('-');
      if (years.length === 2) {
        setSchoolYear(prev => ({
          ...prev,
          Nam1: years[0].trim(),
          Nam2: years[1].trim(),
          TenNamHoc: value
        }));
      }
    }

    // Automatically update TenNamHoc when Nam1 or Nam2 changes
    if (name === 'Nam1' || name === 'Nam2') {
      const nam1 = name === 'Nam1' ? value : schoolYear.Nam1;
      const nam2 = name === 'Nam2' ? value : schoolYear.Nam2;
      if (nam1 && nam2) {
        setSchoolYear(prev => ({
          ...prev,
          [name]: value,
          TenNamHoc: `${nam1}-${nam2}`
        }));
      } else {
        setSchoolYear(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const handleSubmit = async () => {
    // Validate
    if (!schoolYear.TenNamHoc) {
      toast.error("Vui lòng nhập tên năm học");
      return;
    }

    if (!/^\d{4}-\d{4}$/.test(schoolYear.TenNamHoc)) {
      toast.error("Tên năm học phải theo định dạng YYYY-YYYY");
      return;
    }

    if (parseInt(schoolYear.Nam1) >= parseInt(schoolYear.Nam2)) {
      toast.error("Năm bắt đầu phải nhỏ hơn năm kết thúc");
      return;
    }

    // Submit
    let response = await confirmAddSchoolYear(schoolYear);
    
    // Reset form if successful
    if (response && response.data && response.data.EC === 0) {
      setSchoolYear({
        TenNamHoc: '',
        Nam1: '',
        Nam2: ''
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm năm học mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label>Tên năm học</label>
          <input
            type="text"
            className="form-control"
            name="TenNamHoc"
            value={schoolYear.TenNamHoc}
            onChange={handleChange}
            placeholder="VD: 2023-2024"
          />
        </div>
        <div className="form-group">
          <label>Năm bắt đầu</label>
          <input
            type="number"
            className="form-control"
            name="Nam1"
            value={schoolYear.Nam1}
            onChange={handleChange}
            placeholder="VD: 2023"
          />
        </div>
        <div className="form-group">
          <label>Năm kết thúc</label>
          <input
            type="number"
            className="form-control"
            name="Nam2"
            value={schoolYear.Nam2}
            onChange={handleChange}
            placeholder="VD: 2024"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Thêm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddSchoolYear;