import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import _ from "lodash";

const ModalAddAccount = ({ show, handleClose }) => {
    const defaultAccountData = {
        username: "",
        phone: "",
        fullName: "",
        password: "",
        group: "",
    };

    const defaultValidInputs = {
        username: true,
        phone: true,
        fullName: true,
        password: true,
        group: true,
    };

    const [accountData, setAccountData] = useState(defaultAccountData);
    const [validInputs, setValidInputs] = useState(defaultValidInputs);

    const handleOnChangeInput = (value, name) => {
        let _accountData = _.cloneDeep(accountData);
        _accountData[name] = value;
        setAccountData(_accountData);
    };

    const isValidInputs = () => {
        setValidInputs(defaultValidInputs);
        const reEmail = /\S+@\S+\.\S+/;
        const rePhone = /^\d{10,11}$/;
        let isValid = true;

        if (!accountData.username || !reEmail.test(accountData.username)) {
            toast.error("Tên đăng nhập phải là email hợp lệ");
            setValidInputs((prev) => ({ ...prev, username: false }));
            isValid = false;
        } else if (!accountData.phone || !rePhone.test(accountData.phone)) {
            toast.error("Số điện thoại không hợp lệ (10-11 chữ số)");
            setValidInputs((prev) => ({ ...prev, phone: false }));
            isValid = false;
        } else if (!accountData.fullName) {
            toast.error("Họ tên là bắt buộc");
            setValidInputs((prev) => ({ ...prev, fullName: false }));
            isValid = false;
        } else if (!accountData.password || accountData.password.length < 6) {
            toast.error("Mật khẩu phải từ 6 ký tự trở lên");
            setValidInputs((prev) => ({ ...prev, password: false }));
            isValid = false;
        } else if (!accountData.group) {
            toast.error("Phải chọn nhóm người dùng");
            setValidInputs((prev) => ({ ...prev, group: false }));
            isValid = false;
        }

        return isValid;
    };

    const confirmAddAccount = async () => {
        const isValid = isValidInputs();
        if (isValid) {
            console.log("Tạo account thành công với dữ liệu:", accountData);
            toast.success("Tạo tài khoản thành công!");

            setAccountData(defaultAccountData);
            setValidInputs(defaultValidInputs);
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm tài khoản</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Tên đăng nhập (Email)</label>
                    <input
                        type="email"
                        className={
                            validInputs.username ? "form-control" : "form-control is-invalid"
                        }
                        value={accountData.username}
                        onChange={(e) => handleOnChangeInput(e.target.value, "username")}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input
                        type="text"
                        className={
                            validInputs.phone ? "form-control" : "form-control is-invalid"
                        }
                        value={accountData.phone}
                        onChange={(e) => handleOnChangeInput(e.target.value, "phone")}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Họ tên</label>
                    <input
                        type="text"
                        className={
                            validInputs.fullName ? "form-control" : "form-control is-invalid"
                        }
                        value={accountData.fullName}
                        onChange={(e) => handleOnChangeInput(e.target.value, "fullName")}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input
                        type="password"
                        className={
                            validInputs.password ? "form-control" : "form-control is-invalid"
                        }
                        value={accountData.password}
                        onChange={(e) => handleOnChangeInput(e.target.value, "password")}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Nhóm người dùng</label>
                    <select
                        className={
                            validInputs.group ? "form-select" : "form-select is-invalid"
                        }
                        value={accountData.group}
                        onChange={(e) => handleOnChangeInput(e.target.value, "group")}
                    >
                        <option value="">-- Chọn nhóm --</option>
                        <option value="Admin">Admin</option>
                        <option value="Teacher">Giáo viên</option>
                        <option value="Student">Học sinh</option>
                    </select>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={confirmAddAccount}>
                    Thêm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAddAccount;
