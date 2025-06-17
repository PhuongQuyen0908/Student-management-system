import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import _ from "lodash";

const ModalDeleteGradeClass = ({ show, handleClose, gradeData, onSubmit }) => {
    const confirmDeleteGrade = async () => {
        try {
            const id = gradeData.MaKhoi;
            await onSubmit(id);
            handleClose();
        } catch (error) {
            toast.error("Không thể kết nối đến máy chủ", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xóa khối lớp</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Bạn có chắc chắn muốn xóa khối lớp{" "}
                <strong>{gradeData.TenKhoi}</strong> không?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={confirmDeleteGrade}>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDeleteGradeClass;
