import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './Modal.scss'
import _, { set } from "lodash";  // dùng lodash để deep clone object

//CRUD
import { createStudent, updateCurrentStudent } from '../../services/studentServices.js'

const ModalStudent = (props) => {

  const { action, dataModalStudent } = props;

  const defaultStudentData = {
    studentId:"",
    studentName: "",
    studentBirth: "",
    studentAddress: "",
    studentPhone: "",
    studentEmail: "",
    studentGender: "Male"
  }
  //Phần này sẽ thêm vào trang studentList
  const defaultValidInputs = {
    studentName: true,
    studentBirth: true,
    studentAddress: true,
    studentPhone: true,
    studentEmail: true,
    studentGender: true
  }

  const [studentData, setStudentData] = useState(defaultStudentData);
  const [validInputs, setValidInputs] = useState(defaultValidInputs);

  useEffect(() => {
    if (action === "UPDATE") {
        console.log(dataModalStudent);
        setStudentData({
          studentId: dataModalStudent.maHS,
          studentName: dataModalStudent.HoTen,
          studentBirth: dataModalStudent.NgaySinh,
          studentAddress: dataModalStudent.DiaChi,
          studentPhone: dataModalStudent.SoDienThoai,
          studentEmail: dataModalStudent.Email,
          studentGender: dataModalStudent.GioiTinh
        });
    }
}, [dataModalStudent])


  //Navigate : chưa có
  const handleOnChangeInput = (value, name) => {
    let _studentData = _.cloneDeep(studentData); // deep clone object
    _studentData[name] = value;
    setStudentData(_studentData);
  }

  //check valid 
  //Cần check thêm các trường hợp như email, phone, ngày sinh
  const checkValidateInputs = () => {
    setValidInputs(defaultValidInputs);
    let arr = ["studentName", "studentBirth", "studentEmail", "studentPhone", "studentAddress"]
    let check = true;
    for (let i = 0; i < arr.length; i++) {
      let name = arr[i];
      if (!studentData[name]) {
        toast.error(`${name} is required`);
        setValidInputs({ ...defaultValidInputs, [name]: false });
        check = false;
        break;
      }
    }
    return check;
  }

  const handleConfirmStudent = async () => {
    let check = checkValidateInputs();
    if (check === true) {
      //gọi api thêm học sinh
      let response = action === 'CREATE' ? await createStudent(studentData) : await updateCurrentStudent(studentData) ;
      console.log(studentData);
      let serverData = response.data;
      if (response && response.data && +response.data.EC === 0) {
        toast.success(serverData.EM);
        props.onHide();
        setStudentData(defaultStudentData);
      }
      else {
        toast.error(serverData.EM);
        let _validInputs = _.cloneDeep(validInputsDefault);
        _validInputs[res.data.DT] = false;
        setValidInputs(_validInputs);
      }
    }
  }

  const handleCloseModalStudent = () => {
    props.onHide();
    setStudentData(defaultStudentData)
    setValidInputs(defaultValidInputs);
  }


  return (
    <>
      <Modal
        show={props.isShowModalStudent}
        onHide={() => handleCloseModalStudent()}
        centered
        size="lg"
        className="modal-student"
      >
        <Modal.Header closeButton>
          <div>
            <Modal.Title>
              <span>{action === 'CREATE' ? 'Thêm' : 'Sửa học sinh'}</span>
            </Modal.Title>
            <span className="sub-heading">Thông tin cá nhân</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row  form-container">
            {action === 'UPDATE' &&
              <div className="mb-3 col-12 ">
                <label htmlFor="studentId" className="form-label">Mã học sinh</label>
                <input
                  type="text"
                  className="form-control"
                  id="studentId"  
                  value={studentData.studentId}
                  disabled/>
              </div>
}
            <div className="mb-3 col-12 col-sm-5 ">
              <label htmlFor="studentName" className="form-label">Tên học sinh</label>
              <input
                type="text"
                className={validInputs.studentName ? "form-control" : "is-invalid form-control"}
                id="studentName"
                placeholder="Nhập tên học sinh"
                value={studentData.studentName}
                onChange={(event) => handleOnChangeInput(event.target.value, "studentName")}
              />
            </div>

            <div className="mb-3 col-12 col-sm-4">
              <label htmlFor="studentBirth" className="form-label">Ngày sinh</label>
              <input
                type="date"
                className={validInputs.studentBirth ? "form-control" : "is-invalid form-control"}
                id="studentBirth"
                value={studentData.studentBirth}
                onChange={(event) => handleOnChangeInput(event.target.value, "studentBirth")}
              />
            </div>

            <div className="mb-3 col-12 col-sm-3">
              <div className="form-group">
                <label className="form-label">Giới tính</label>
                <select
                  className='form-select'
                  onChange={(event) => handleOnChangeInput(event.target.value, "studentGender")}
                >
                  <option defaultValue="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div className="mb-3 col-12 col-sm-6">
              <label htmlFor="studentEmail" className="form-label">Email</label>
              <input
                type="email"
                className={validInputs.studentEmail ? "form-control" : "is-invalid form-control"}
                id="studentEmail"
                placeholder="Nhập email học sinh"
                value={studentData.studentEmail}
                onChange={(event) => handleOnChangeInput(event.target.value, "studentEmail")}
              />
            </div>

            <div className="mb-3 col-12 col-sm-6">
              <label htmlFor="studentPhone" className="form-label">Số điện thoại</label>
              <input
                type="text"
                className={validInputs.studentPhone ? "form-control" : "is-invalid form-control"}
                id="studentPhone"
                placeholder="Nhập số điện thoại học sinh"
                value={studentData.studentPhone}
                onChange={(event) => handleOnChangeInput(event.target.value, "studentPhone")}
              />
            </div>


            <div className="mb-3 col-12 col-sm-12">
              <label htmlFor="studentAddress" className="form-label">Địa chỉ</label>
              <input
                type="text"
                className={validInputs.studentAddress ? "form-control" : "is-invalid form-control"}
                id="studentAddress"
                placeholder="Thành phố Hồ Chí Minh"
                value={studentData.studentAddress}
                onChange={(event) => handleOnChangeInput(event.target.value, "studentAddress")}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>handleCloseModalStudent()}>
            Hủy
          </Button>
          <Button variant="primary" onClick={()=>handleConfirmStudent()}>
            {action ==='CREATE'?'Thêm':'Sửa'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalStudent;