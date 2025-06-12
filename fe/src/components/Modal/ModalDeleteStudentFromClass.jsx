import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

const ModalDeleteStudentFromClass = (props) => {
  const confirmDeleteStudentFromClass = async () => {
    try {
      const id = props.dataModal;
      await props.onSubmit(id);
      props.handleClose();
    } catch (error) {
      console.log("Error", error);
    }
  };
  return (
    <Modal show={props.show} onHide={props.handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xóa học sinh ra danh sách lớp</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có xác nhận xóa học sinh ra khỏi danh sách lớp?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Hủy
        </Button>
        <Button
          variant="danger"
          onClick={() => props.onSubmit(props.dataModal)}
        >
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteStudentFromClass;
