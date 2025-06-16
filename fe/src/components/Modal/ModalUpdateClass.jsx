import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import _ from "lodash";

const ModalUpdateClass = ({
  show,
  handleClose,
  classData,
  onSubmit,
  gradesList,
}) => {
  const defaultDataForm = {
    className: classData.TenLop || "",
    classGrade: classData.MaKhoi || "",
  };

  const defaultValidInput = {
    isValidClassName: true,
    isValidClassGrade: true,
  };

  const [formData, setFormData] = useState(defaultDataForm);
  const [objValidInput, setObjValidInput] = useState(defaultValidInput);

  // Load lại dữ liệu mỗi khi mở modal của lớp được chọn
  useEffect(() => {
    if (show && classData) {
      setFormData({
        className: classData.TenLop || "",
        classGrade: classData.MaKhoi || "",
      });
      setObjValidInput(defaultValidInput);
    }
  }, [show, classData]);

  // Xử lý khi người dùng nhập
  const handleOnChangeInput = (value, field) => {
    const updated = _.cloneDeep(formData);
    updated[field] = value;
    setFormData(updated);
  };

  // Kiểm tra thông tin update có hợp lệ không (không trống)
  const isValidInputs = () => {
    setObjValidInput(defaultValidInput);
    let isValid = true;
    if (!formData.className) {
      toast.error("Tên lớp học là bắt buộc, không được để trống");
      setObjValidInput((prev) => ({ ...prev, isValidClassName: false }));
      isValid = false;
    }
    if (!formData.classGrade) {
      toast.error("Khối lớp là bắt buộc");
      setObjValidInput((prev) => ({ ...prev, isValidClassGrade: false }));
      isValid = false;
    }
    return isValid;
  };

  const confirmUpdateClass = async () => {
    let isValid = isValidInputs();
    if (!isValid) return;
    try {
      const response = await onSubmit({
        TenLop: formData.className,
        MaKhoi: formData.classGrade,
        MaLop: classData.MaLop,
      });
      if (response?.data?.EC === 0) {
        handleClose();
        setFormData(defaultDataForm);
        setObjValidInput(defaultValidInput);
      }
    } catch {
      toast.error("Không thể kết nối đến máy chủ");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sửa lớp học</Modal.Title>
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
            placeholder="Lớp 10A"
            value={formData.className}
            onChange={(e) => handleOnChangeInput(e.target.value, "className")}
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
            value={formData.classGrade}
            onChange={(e) => handleOnChangeInput(e.target.value, "classGrade")}
          >
            <option value="">Chọn khối</option>
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
        <Button variant="primary" onClick={confirmUpdateClass}>
          Sửa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalUpdateClass;
