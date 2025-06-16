import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import _ from "lodash";

//import 06/06/2025
import { fetchGroup ,createUser} from "../../services/userServices";

const ModalAddAccount = ({ show, handleClose , fetchAccounts}) => {
    const defaultAccountData = {
        TenDangNhap: "",
        SoDienThoai: "",
        HoTen: "",
        MatKhau: "",
        MaNhom: "",
    };

    const defaultValidInputs = {
        TenDangNhap: true,
        SoDienThoai: true,
        HoTen: true,
        MatKhau: true,
        MaNhom: true,
    };

    const [accountData, setAccountData] = useState(defaultAccountData);
    const [validInputs, setValidInputs] = useState(defaultValidInputs);
    const [userGroups, setUserGroups] = useState([]);

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

        if (!reEmail.test(accountData.TenDangNhap)) {
            toast.error("Tên đăng nhập phải là email hợp lệ");
            setValidInputs((prev) => ({ ...prev, TenDangNhap: false }));
            isValid = false;
        } else if (!accountData.SoDienThoai || !rePhone.test(accountData.SoDienThoai)) {
            toast.error("Số điện thoại không hợp lệ (10-11 chữ số)");
            setValidInputs((prev) => ({ ...prev, SoDienThoai: false }));
            isValid = false;
        } else if (!accountData.HoTen) {
            toast.error("Họ tên là bắt buộc");
            setValidInputs((prev) => ({ ...prev, HoTen: false }));
            isValid = false;
        } else if (!accountData.MatKhau || accountData.MatKhau.length < 6) {
            toast.error("Mật khẩu phải từ 6 ký tự trở lên");
            setValidInputs((prev) => ({ ...prev, MatKhau: false }));
            isValid = false;
        } else if (!accountData.MaNhom) {
            toast.error("Phải chọn nhóm người dùng");
            setValidInputs((prev) => ({ ...prev, MaNhom: false }));
            isValid = false;
        }

        return isValid;
    };

    const fetchGroups = async () => {
        try {
            const response = await fetchGroup();
            if (response && response.data.EC === 0) {
                console.log("Danh sách nhóm người dùng:", response.data.DT);
                setUserGroups(response.data.DT);
                if(response.data.DT && response.data.DT.length > 0) {
                    setAccountData((prev) => ({
                        ...prev,
                        MaNhom: response.data.DT[0].MaNhom, // Chọn nhóm đầu tiên làm mặc định
                    }));
                }
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

    const confirmAddAccount = async () => {
        const isValid = isValidInputs();
        if (isValid) {
            const response = await createUser(accountData);
            if (response && response.data && +response.data.EC === 0) {
                await fetchAccounts();
                toast.success(response.data.EM);
                setAccountData(defaultAccountData);
                setValidInputs(defaultValidInputs);
                handleClose();
            }
            else{
                toast.error(response.data.EM || "Lỗi khi thêm tài khoản");

            }
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
                            validInputs.TenDangNhap ? "form-control" : "form-control is-invalid"
                        }
                        value={accountData.TenDangNhap}
                        onChange={(e) => handleOnChangeInput(e.target.value, "TenDangNhap")}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input
                        type="text"
                        className={
                            validInputs.SoDienThoai ? "form-control" : "form-control is-invalid"
                        }
                        value={accountData.SoDienThoai}
                        onChange={(e) => handleOnChangeInput(e.target.value, "SoDienThoai")}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Họ tên</label>
                    <input
                        type="text"
                        className={
                            validInputs.HoTen ? "form-control" : "form-control is-invalid"
                        }
                        value={accountData.HoTen}
                        onChange={(e) => handleOnChangeInput(e.target.value, "HoTen")}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input
                        type="MatKhau"
                        className={
                            validInputs.MatKhau ? "form-control" : "form-control is-invalid"
                        }
                        value={accountData.MatKhau}
                        onChange={(e) => handleOnChangeInput(e.target.value, "MatKhau")}
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
                <Button variant="primary" onClick={confirmAddAccount}>
                    Thêm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAddAccount;
