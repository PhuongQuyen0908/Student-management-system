import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { deleteGroup } from '../../services/userServices';


const ModalDeleteGroup = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xóa nhóm người dùng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Bạn xác nhận xóa nhóm người dùng ? 
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={()=> props.confirmDeleteGroup(props.MaNhom)}>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalDeleteGroup;
