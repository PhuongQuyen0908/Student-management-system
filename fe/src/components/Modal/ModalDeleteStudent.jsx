import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';


const  ModalDeleteStudent = (props) => {
 

  return (
    <>

      <Modal show={props.show} onHide={props.handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xóa học sinh</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có xác nhận xóa học sinh {props.dataModal.HoTen}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={props.confirmDeleteStudent}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDeleteStudent;



