import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import _ from "lodash";

const ModalDeleteClass = ({ show, handleClose, classData, onSubmit }) => {
  const confirmDeleteClass = async () => {
    try {
      const id = classData.MaLop;
      await onSubmit(id);
      handleClose();
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xóa lớp học</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có xác nhận xóa lớp {classData.TenLop} không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={confirmDeleteClass}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDeleteClass;
