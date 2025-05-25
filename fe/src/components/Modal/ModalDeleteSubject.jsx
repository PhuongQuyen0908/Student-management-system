import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const ModalDeleteSubject = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xóa môn học</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Bạn có xác nhận xóa môn học <strong>{props.dataModal.TenMonHoc}</strong>?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={props.confirmDeleteSubject}>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalDeleteSubject;
