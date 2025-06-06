import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';

const ModalDeleteAccount = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xóa tài khoản</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Bạn xác nhận xóa người dùng: <strong>{props.dataModal.TenDangNhap}</strong>?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={props.confirmDeleteAccount}>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalDeleteAccount;
