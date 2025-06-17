import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalDeleteSchoolYear = (props) => {
  const { show, handleClose, confirmDeleteSchoolYear, dataModal } = props;

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Xóa năm học</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="body-add-new">
          Bạn có chắc chắn muốn xóa năm học <b>{dataModal.TenNamHoc}</b>?
          <br />
          Hành động này không thể hoàn tác.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={confirmDeleteSchoolYear}>
          Xác nhận
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteSchoolYear;