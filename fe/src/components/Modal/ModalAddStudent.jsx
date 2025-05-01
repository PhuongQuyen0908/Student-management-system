import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { createStudent } from '../../services/studentServices.js'
import _, { set } from "lodash";  // dùng lodash để deep clone object


const ModalAddStudent = ({ show, handleClose , fetchStudents }) => {
  // const [studentName, setStudentName] = useState("");
  // const [studentBirth, setStudentBirth] = useState("");
  // const [studentAddress, setStudentAddress] = useState("");
  // const [studentEmail, setStudentEmail] = useState("");
  // const [Gender, setGender] = useState("Male");

  const defaultStudentData = {
    studentId:"",
    studentName: "",
    studentBirth: "",
    studentAddress: "",
    studentEmail: "",
    studentGender: "Nam"
  }

  const defaultValidInputs = {
    studentName: true,
    studentBirth: true,
    studentAddress: true,
    studentEmail: true,
  };
  
  const [validInputs, setValidInputs] = useState(defaultValidInputs);
  const [studentData, setStudentData] = useState(defaultStudentData);

  const handleOnChangeInput = (value, name) => {
    let _studentData = _.cloneDeep(studentData); // deep clone object
    _studentData[name] = value;
    setStudentData(_studentData);
  }

  const isValidInputs = () => {

    setValidInputs(defaultValidInputs);
    const re = /\S+@\S+\.\S+/;
    let arr = ["studentName", "studentBirth", "studentEmail", "studentAddress"]
    let isValid = true;
    for (let i = 0; i < arr.length; i++) {
      let name = arr[i];
      if (!studentData[name]) { // nếu không có giá trị
        toast.error(`${name} là bắt buộc`);
        setValidInputs({
          ...defaultValidInputs,
          [name]: false
        });
        isValid = false;
        break;
      }
      else  if (!re.test(studentData.studentEmail)) { //emai không đúng định dạng @....
        toast.error("Email không hợp lệ");
        setValidInputs({ ...defaultValidInputs,studentEmail: false });
        isValid= false;
      }
    }

    return isValid;
  };

  const confirmAddStudent = async () => {
    const isValid = isValidInputs();
    if (isValid) {
      let response =  await createStudent(studentData);
      console.log("response", response);
      let serverData = response.data;
      if (response && response.data && +response.data.EC === 0) {
        toast.success(serverData.EM);
        await fetchStudents(); // load lại page
        handleClose(); // đóng modal
        setValidInputs(defaultValidInputs); // reset lại validInputs
        setStudentData(defaultStudentData); // reset lại studentData
      }
      else {
        toast.error(serverData.EM); // thông báo lỗi từ server
        // nếu không thành công thì set lại validInputs để hiển thị lỗi ( có thể email trùng , ... )
        let _validInputs = _.cloneDeep(defaultValidInputs);
        _validInputs[response.data.DT] = false;
        setValidInputs(_validInputs);
      }

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
            className={validInputs.studentName ? "form-control" : "form-control is-invalid"}
            id="studentName"
            value={studentData.studentName}
            onChange={(event) =>handleOnChangeInput(event.target.value, "studentName")}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="studentBirth" className="form-label">Ngày sinh</label>
          <input
            type="date"
            className={validInputs.studentBirth ? "form-control" : "form-control is-invalid"}
            id="studentBirth"
            value={studentData.studentBirth}
            onChange={(event) => handleOnChangeInput(event.target.value, "studentBirth")}
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
                value="Nam"
                id="Male"
                checked={studentData.studentGender === "Nam"}
                onChange={(event) => handleOnChangeInput(event.target.value, "studentGender")}
              />
              <label className="form-check-label" htmlFor="Male">Nam</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="Gender"
                value="Nữ"
                id="Female"
                checked={studentData.studentGender === "Nữ"}
                onChange={(event)=>handleOnChangeInput(event.target.value, "studentGender")}
              />
              <label className="form-check-label" htmlFor="Female">Nữ</label>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="studentAddress" className="form-label">Địa chỉ</label>
          <input
            type="text"
            className={validInputs.studentAddress ? "form-control" : "form-control is-invalid"}
            id="studentAddress"
            value={studentData.studentAddress}
            onChange={(event) => handleOnChangeInput(event.target.value, "studentAddress")}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="studentEmail" className="form-label">Email</label>
          <input
            type="email"
            className={validInputs.studentEmail ? "form-control" : "form-control is-invalid"}
            id="studentEmail"
            value={studentData.studentEmail}
            onChange={(event) => handleOnChangeInput(event.target.value, "studentEmail")}
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
