import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import _ from "lodash";

const ModalUpdateAccount = ({ show, handleClose, dataModalAccount }) => {
    const defaultAccountData = {
        username: "",
        fullName: "",
        phoneNumber: ""
    };

    const defaultValidInputs = {
        fullName: true,
        phoneNumber: true
    };

    const [accountData, setAccountData] = useState(defaultAccountData);
    const [validInputs, setValidInputs] = useState(defaultValidInputs);

    useEffect(() => {
        setAccountData({
            username: dataModalAccount?.TenDangNhap || "",
            fullName: dataModalAccount?.HoTen || "",
            phoneNumber: dataModalAccount?.SoDienThoai || ""
        });
    }, [dataModalAccount]);

    const handleOnChangeInput = (value, name) => {
        let _accountData = _.cloneDeep(accountData);
        _accountData[name] = value;
        setAccountData(_accountData);
    };

    const isValidInputs = () => {
        setValidInputs(defaultValidInputs);
        let isValid = true;

        if (!accountData.fullName) {
            toast.error("Họ tên là bắt buộc");
            setValidInputs(prev => ({ ...prev, fullName: false }));
            isValid = false;
        } else if (!accountData.phoneNumber) {
            toast.error("Số điện thoại là bắt buộc");
            setValidInputs(prev => ({ ...prev, phoneNumber: false }));
            isValid = false;
        }

        return isValid;
    };

    const confirmUpdateAccount = () => {
        if (isValidInputs()) {
            console.log("Thông tin tài khoản được cập nhật:", accountData);
            toast.success("Cập nhật thành công (giả lập)");
            handleClose();
            setAccountData(defaultAccountData);
            setValidInputs(defaultValidInputs);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sửa tài khoản</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={accountData.username}
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Họ tên</label>
                    <input
                        type="text"
                        className={validInputs.fullName ? "form-control" : "form-control is-invalid"}
                        id="fullName"
                        value={accountData.fullName}
                        onChange={(e) => handleOnChangeInput(e.target.value, "fullName")}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                    <input
                        type="text"
                        className={validInputs.phoneNumber ? "form-control" : "form-control is-invalid"}
                        id="phoneNumber"
                        value={accountData.phoneNumber}
                        onChange={(e) => handleOnChangeInput(e.target.value, "phoneNumber")}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={confirmUpdateAccount}>
                    Cập nhật
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUpdateAccount;
