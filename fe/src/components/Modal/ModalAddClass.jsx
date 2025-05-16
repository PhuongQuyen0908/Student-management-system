import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import _ from "lodash";
import { createClass } from "../../services/classService";
import { fetchAllGrades } from "../../services/classService";

const ModalAddClass = ({
  show,
  handleClose,
  onSubmit,
  fetchClass,
  gradesList,
}) => {
  // const [className, setClassName] = useState("");
  // const [classGrade, setClassGrade] = useState("");

  //Data của lớp học
  const defaultClassData = {
    className: "",
    classGrade: "",
  };
  const defaultValidInput = {
    isValidClassName: true,
    isValidClassGrade: true,
  };

  //Form state
  const [classData, setClassData] = useState(defaultClassData);
  const [objValidInput, setObjValidInput] = useState(defaultValidInput);

  //Reset form lại mỗi khi mở modal
  useEffect(() => {
    if (show) {
      setClassData(defaultClassData);
      setObjValidInput(defaultValidInput);
    }
  }, [show]);

  //Xử lý khi người dùng thay đổi các giá trị trong form
  //Value: giá trị, field: trường thay đổi
  const handleOnChangeInput = (value, field) => {
    let _classData = _.cloneDeep(classData);
    _classData[field] = value;
    setClassData(_classData);
  };

  const isValidInputs = () => {
    setObjValidInput(defaultValidInput);
    let isValid = true;
    if (!classData.className) {
      toast.error("Tên lớp học là bắt buộc, không được để trống");
      setObjValidInput({ ...defaultValidInput, isValidClassName: false });
      isValid = false;
    }
    if (!classData.classGrade) {
      toast.error("Khối lớp là bắt buộc, không được để trống");
      setObjValidInput({ ...defaultValidInput, isValidClassGrade: false });
      isValid = false;
    }
    return isValid;
  };

  //Xác nhận thêm lớp
  const confirmAddClass = async () => {
    let isValid = isValidInputs();
    if (!isValid) return;
    try {
      let response = await onSubmit?.(classData);
      if (response?.EC === 0) {
        toast.success("Thêm lớp học thành công"); //Xuất thông báo
        await fetchClass(); //Load lại danh sách học sinh
        handleClose(); //Đóng modal
        setObjValidInput(defaultValidInput);
        setClassData(defaultClassData);
      } else if (response?.EC === 1 && response?.EM === "Lớp học đã tồn tại") {
        toast.error("Lớp học đã tồn tại");
        setObjValidInput({ ...defaultValidInput, isValidClassName: false });
      } else {
        toast.error("Thêm lớp học thất bại");
      }
    } catch {
      toast.error("Có lỗi xảy ra trong quá trình thêm lớp học");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm lớp học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="className" className="form-label">
            Tên lớp học
          </label>
          <input
            type="text"
            className={
              objValidInput.isValidClassName
                ? "form-control"
                : "form-control is-invalid"
            }
            id="className"
            value={classData.className}
            onChange={(event) =>
              handleOnChangeInput(event.target.value, "className")
            }
          />
        </div>

        <div className="mb-3">
          <label htmlFor="classGrade" className="form-label">
            Khối lớp
          </label>
          <select
            className={
              objValidInput.isValidClassGrade
                ? "form-control"
                : "form-control is-invalid"
            }
            id="classGrade"
            value={classData.classGrade}
            onChange={(e) => handleOnChangeInput(e.target.value, "classGrade")}
          >
            <option value="">Chọn khối lớp</option>
            {gradesList.map((grade) => (
              <option key={grade.MaKhoi} value={grade.MaKhoi}>
                {grade.TenKhoi}
              </option>
            ))}
          </select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={confirmAddClass}>
          Thêm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddClass;
