
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

//CHƯA CÓ API NÊN PHẦN NÀY CHƯA LẤY THÔNG TIN HỌC SINH ĐƯỢC

const ModalUpdateStudent = (props) => {
  const [isShowModalUpdate, setisShowModalUpdate] = useState(false);
  const handleClose = () => setisShowModalUpdate(false);
  const handleShow = () => setisShowModalUpdate(true);

  const [studentName, setStudentName] = useState("");
  const [studentBirth, setStudentBirth] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [Gender, setGender] = useState("Male");

  //Phần này sẽ thêm vào trang studentList
  const defaultValidInput = {
    isValidStudentName: true,
    isValidStudentBirth: true,
    isValidStudentAddress: true,
    isValidStudentEmail: true,
  }
  const [objValidInput, setObjValidInput] = useState(defaultValidInput);

  //Navigate : chưa có

  //check valid 
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

    if (!email) {
      toast.error("Email is required");
      setObjValidInput({ ...defaultValidInput, isValidEmail: false });
      return false;
    }

    let re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      setObjValidInput({ ...defaultValidInput, isValidPhone: false });
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  }

  const confirmAddStudent = async () => { 
    let check = isValidInputs();
    if (check === true){
      //gọi api thêm học sinh
      toast.success("Thêm học sinh thành công");
      setisShowModalUpdate(false);
    }
  }


  useEffect(() => {
    console.log(studentBirth);
  });

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Sửa học sinh
      </Button>

      <Modal show={isShowModalUpdate} onHide={handleClose} centered >
        <Modal.Header closeButton>
          <Modal.Title>Sửa học sinh</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <div className="mb-3">
            <label htmlFor="studentId" className="form-label">Mã học sinh</label>
            <input
              type="text"
              className={objValidInput.isValidStudentName ? "form-control" : "is-invalid form-control"}
              id="studentId"
              placeholder="Không được sửa"
              //value={studentName}
              //onChange={(e) => setStudentName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="studentName" className="form-label">Tên học sinh</label>
            <input
              type="text"
              className={objValidInput.isValidStudentName ? "form-control" : "is-invalid form-control"}
              id="studentName"
              placeholder="bao phuc"
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
            <div className="d-flex flex-row justify-content-start gap-3">
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
                  value="Female"
                  id="Female"
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
              id="studentAdrress"
              placeholder="Thành phố Hồ Chí Minh"
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
              placeholder="nguyenlam.baophuc@gmail.com"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={confirmAddStudent}>
            Sửa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalUpdateStudent;