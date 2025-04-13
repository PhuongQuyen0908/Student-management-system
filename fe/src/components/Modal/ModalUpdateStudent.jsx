import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const ModalUpdateStudent = ({ show, handleClose }) => {
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

  // Validate input
  const isValidInputs = () => {
    setObjValidInput(defaultValidInput);

    if (!studentName) {
      toast.error("Student name is required");
      setObjValidInput({ ...defaultValidInput, isValidStudentName: false });
      return false;
    }

    if (!studentBirth) {
      toast.error("Student birth is required");
      setObjValidInput({ ...defaultValidInput, isValidStudentBirth: false });
      return false;
    }

    if (!studentAddress) {
      toast.error("Student address is required");
      setObjValidInput({ ...defaultValidInput, isValidStudentAddress: false });
      return false;
    }

    if (!studentEmail) {
      toast.error("Email is required");
      setObjValidInput({ ...defaultValidInput, isValidStudentEmail: false });
      return false;
    }

    let re = /\S+@\S+\.\S+/;
    if (!re.test(studentEmail)) {
      toast.error("Please enter a valid email address");
      setObjValidInput({ ...defaultValidInput, isValidStudentEmail: false });
      return false;
    }

    return true;
  };

  const confirmUpdateStudent = async () => {
    if (isValidInputs()) {
      // Gọi API cập nhật học sinh (sẽ thêm sau)
      toast.success("Cập nhật học sinh thành công");
      handleClose();
    }
  };

  // (Optional) Reset form mỗi khi mở modal
  useEffect(() => {
    if (show) {
      setStudentName("");
      setStudentBirth("");
      setStudentAddress("");
      setStudentEmail("");
      setGender("Male");
      setObjValidInput(defaultValidInput);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sửa học sinh</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="studentId" className="form-label">Mã học sinh</label>
          <input
            type="text"
            className="form-control"
            id="studentId"
            placeholder="Không được sửa"
            disabled
          />
        </div>

        <div className="mb-3">
          <label htmlFor="studentName" className="form-label">Tên học sinh</label>
          <input
            type="text"
            className={objValidInput.isValidStudentName ? "form-control" : "is-invalid form-control"}
            id="studentName"
            placeholder="Nguyễn Văn A"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="studentBirth" className="form-label">Ngày sinh</label>
          <input
            type="date"
            className={objValidInput.isValidStudentBirth ? "form-control" : "is-invalid form-control"}
            id="studentBirth"
            value={studentBirth}
            onChange={(e) => setStudentBirth(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giới tính</label>
          <div className="d-flex flex-row gap-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="Gender"
                id="Male"
                value="Male"
                checked={Gender === "Male"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label className="form-check-label" htmlFor="Male">
                Nam
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="Gender"
                id="Female"
                value="Female"
                checked={Gender === "Female"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label className="form-check-label" htmlFor="Female">
                Nữ
              </label>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="studentAddress" className="form-label">Địa chỉ</label>
          <input
            type="text"
            className={objValidInput.isValidStudentAddress ? "form-control" : "is-invalid form-control"}
            id="studentAddress"
            placeholder="TP. Hồ Chí Minh"
            value={studentAddress}
            onChange={(e) => setStudentAddress(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="studentEmail" className="form-label">Email</label>
          <input
            type="email"
            className={objValidInput.isValidStudentEmail ? "form-control" : "is-invalid form-control"}
            id="studentEmail"
            placeholder="example@gmail.com"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={confirmUpdateStudent}>
          Sửa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalUpdateStudent;
