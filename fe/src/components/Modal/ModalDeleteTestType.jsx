import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import _ from "lodash";

const ModalDeleteTestType = ({ show, handleClose, testData, onSubmit }) => {
    const confirmDeleteTestType = async () => {
        try {
            const id = testData.MaLoaiKiemTra;
            await onSubmit(id);
            handleClose();
        } catch (error) {
            toast.error("Không thể kết nối đến máy chủ", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xóa loại kiểm tra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Bạn có chắc chắn muốn xóa loại kiểm tra{" "}
                <strong>{testData.TenLoaiKiemTra}</strong> không?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={confirmDeleteTestType}>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDeleteTestType;
