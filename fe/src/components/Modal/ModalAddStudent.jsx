import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ModalAddStudent = ({ show, handleClose }) => {
  const [studentName, setStudentName] = useState("");
  const [studentBirth, setStudentBirth] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [Gender, setGender] = useState("Male");

  const defaultValidInput = {
    isValidStudentName: true,
    isValidStudentBirth: true,
    isValidStudentAddress: true,
    isValidStudentEmail: true,
  };

  const [objValidInput, setObjValidInput] = useState(defaultValidInput);

  const isValidInputs = () => {
    setObjValidInput(defaultValidInput);

    if (!studentName) {
      toast.error("Tên học sinh là bắt buộc");
      setObjValidInput({ ...defaultValidInput, isValidStudentName: false });
      return false;
    }

    if (!studentBirth) {
      toast.error("Ngày sinh là bắt buộc");
      setObjValidInput({ ...defaultValidInput, isValidStudentBirth: false });
      return false;
    }

    if (!studentAddress) {
      toast.error("Địa chỉ là bắt buộc");
      setObjValidInput({ ...defaultValidInput, isValidStudentAddress: false });
      return false;
    }

    if (!studentEmail) {
      toast.error("Email là bắt buộc");
      setObjValidInput({ ...defaultValidInput, isValidStudentEmail: false });
      return false;
    }

    const re = /\S+@\S+\.\S+/;
    if (!re.test(studentEmail)) {
      toast.error("Email không hợp lệ");
      setObjValidInput({ ...defaultValidInput, isValidStudentEmail: false });
      return false;
    }

    return true;
  };

  const confirmAddStudent = () => {
    const isValid = isValidInputs();
    if (isValid) {
      toast.success("Thêm học sinh thành công");
      handleClose();

      // Reset form
      setStudentName("");
      setStudentBirth("");
      setStudentAddress("");
      setStudentEmail("");
      setGender("Male");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm học sinh</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="studentName" className="form-label">Tên học sinh</label>
          <input
            type="text"
            className={objValidInput.isValidStudentName ? "form-control" : "form-control is-invalid"}
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="studentBirth" className="form-label">Ngày sinh</label>
          <input
            type="date"
            className={objValidInput.isValidStudentBirth ? "form-control" : "form-control is-invalid"}
            id="studentBirth"
            value={studentBirth}
            onChange={(e) => setStudentBirth(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giới tính</label>
          <div className="d-flex gap-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="Gender"
                value="Male"
                id="Male"
                checked={Gender === "Male"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label className="form-check-label" htmlFor="Male">Nam</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="Gender"
                value="Female"
                id="Female"
                checked={Gender === "Female"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label className="form-check-label" htmlFor="Female">Nữ</label>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="studentAddress" className="form-label">Địa chỉ</label>
          <input
            type="text"
            className={objValidInput.isValidStudentAddress ? "form-control" : "form-control is-invalid"}
            id="studentAddress"
            value={studentAddress}
            onChange={(e) => setStudentAddress(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="studentEmail" className="form-label">Email</label>
          <input
            type="email"
            className={objValidInput.isValidStudentEmail ? "form-control" : "form-control is-invalid"}
            id="studentEmail"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Hủy</Button>
        <Button variant="primary" onClick={confirmAddStudent}>Thêm</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddStudent;
