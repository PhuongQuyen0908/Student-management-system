import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import _ from "lodash";
//import mới
import { fetchGroup, updateUser } from "../../services/userServices";

const ModalUpdateAccount = ({ show, handleClose, dataModalAccount, fetchAccounts}) => {
    const defaultAccountData = {
        TenDangNhap: "",
        HoTen: "",
        SoDienThoai: "",
        MaNhom: "",
    };

    const defaultValidInputs = {
        HoTen: true,
        SoDienThoai: true,
        MaNhom: true,
    };

    const [accountData, setAccountData] = useState(defaultAccountData);
    const [validInputs, setValidInputs] = useState(defaultValidInputs);
    const [userGroups, setUserGroups] = useState([]);


    useEffect(() => {
        setAccountData({
            TenDangNhap: dataModalAccount?.TenDangNhap || "",
            HoTen: dataModalAccount?.HoTen || "",
            SoDienThoai: dataModalAccount?.SoDienThoai || "",
            MaNhom: dataModalAccount?.nhomnguoidung.MaNhom || "",

        });
    }, [dataModalAccount]);

    const fetchGroups = async () => {
        try {
            const response = await fetchGroup();
            if (response && response.data.EC === 0) {
                setUserGroups(response.data.DT);
            } else {
                toast.error(response.EM || "Lỗi khi lấy danh sách nhóm người dùng");
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhóm người dùng:", error);
            toast.error("Lỗi kết nối đến máy chủ");
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleOnChangeInput = (value, name) => {
        let _accountData = _.cloneDeep(accountData);
        _accountData[name] = value;
        setAccountData(_accountData);
    };

    const isValidInputs = () => {
        setValidInputs(defaultValidInputs);
        let isValid = true;

        if (!accountData.HoTen) {
            toast.error("Họ tên là bắt buộc");
            setValidInputs(prev => ({ ...prev, HoTen: false }));
            isValid = false;
        } else if (!accountData.SoDienThoai) {
            toast.error("Số điện thoại là bắt buộc");
            setValidInputs(prev => ({ ...prev, SoDienThoai: false }));
            isValid = false;
        }

        return isValid;
    };

    const confirmUpdateAccount = async () => {
        if (isValidInputs()) {
            let response = await updateUser(accountData);
            if(response && response.data && +response.data.EC === 0) {
                await fetchAccounts(); // Cập nhật lại danh sách tài khoản
                toast.success(response.data.EM);
                handleClose();
                setAccountData(defaultAccountData);
                setValidInputs(defaultValidInputs);
            } else {
                toast.error(response.data.EM || "Cập nhật tài khoản không thành công");
                let _validInputs = _.cloneDeep(defaultValidInputs);
                _validInputs[response.data.DT] = false; // response.data.DT là trường không hợp lệ
                setValidInputs(_validInputs);
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sửa tài khoản</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="TenDangNhap" className="form-label">Tên đăng nhập</label>
                    <input
                        type="text"
                        className="form-control"
                        id="TenDangNhap"
                        value={accountData.TenDangNhap}
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="HoTen" className="form-label">Họ tên</label>
                    <input
                        type="text"
                        className={validInputs.HoTen ? "form-control" : "form-control is-invalid"}
                        id="HoTen"
                        value={accountData.HoTen}
                        onChange={(e) => handleOnChangeInput(e.target.value, "HoTen")}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="SoDienThoai" className="form-label">Số điện thoại</label>
                    <input
                        type="text"
                        className={validInputs.SoDienThoai ? "form-control" : "form-control is-invalid"}
                        id="SoDienThoai"
                        value={accountData.SoDienThoai}
                        onChange={(e) => handleOnChangeInput(e.target.value, "SoDienThoai")}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Nhóm người dùng</label>
                    <select
                        className={
                            validInputs.MaNhom ? "form-select" : "form-select is-invalid"
                        }
                        value={accountData.MaNhom}
                        onChange={(e) => handleOnChangeInput(e.target.value, "MaNhom")}
                    >
                       { userGroups && userGroups.length > 0 ? (
                            userGroups.map((group) => (
                                <option key={`group-${group.MaNhom}`} value={group.MaNhom}>
                                    {group.TenNhom}
                                </option>
                            ))
                        ) : (
                            <option value="">Không có nhóm người dùng</option>
                        )}
                    </select>
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
