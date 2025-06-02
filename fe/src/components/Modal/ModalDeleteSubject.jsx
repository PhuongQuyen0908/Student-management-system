import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

const ModalDeleteSubject = (props) => {
  const confirmDeleteSubject = async () => {
    try {
      const id = props.dataModal.MaMonHoc;
      await props.onSubmit(id);
      props.handleClose();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };
  return (
    <Modal show={props.show} onHide={props.handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xóa môn học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có xác nhận xóa môn học <strong>{props.dataModal.TenMonHoc}</strong>
        ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Hủy
        </Button>
        <Button variant="danger" onClick={confirmDeleteSubject}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteSubject;
