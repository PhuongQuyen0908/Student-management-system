import '../../styles/Page/InfoPage.scss';
import  {UserContext}  from '../../context/UserContext';
import { useContext , useState } from 'react';
import {toast} from 'react-toastify';
import { changePassword } from '../../services/userServices';
const InfoPage = () => {
    const { user } = useContext(UserContext);
    const [oldPassword , setOldPassword] = useState("");
    const [newPassword , setNewPassword] = useState("");
    const [confirmNewPassword , setConfirmNewPassword] = useState("");

    const handleChangePassword = (e , type) => {
        if(type === 'oldPassword'){
            setOldPassword(e.target.value);
        }else if(type === 'newPassword'){
            setNewPassword(e.target.value);
        }else if(type === 'confirmNewPassword'){
            setConfirmNewPassword(e.target.value);
        }
    }

    const CheckPassword = (oldPassword, newPassword, confirmNewPassword) => {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            toast.error("Vui lòng điền đầy đủ thông tin mật khẩu");
            return false;
        }
        else if (newPassword !== confirmNewPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
            return false;
        }
        else if (newPassword.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
            return false;
        }
        return true;
    }

    const UpdatePassword = async () => {
        if (CheckPassword(oldPassword, newPassword, confirmNewPassword)) {
            let data = {
                TenDangNhap: user.account.username,
                MatKhauCu: oldPassword,
                MatKhauMoi: newPassword,
                XacNhanMatKhau: confirmNewPassword
            }
            let response = await changePassword(data);
            if (response && +response.data.EC === 0) {
                toast.success(response.data.EM);
                setOldPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            } else {
                toast.error(response.data.EM);
            }
        }
    }
    return (
        <div className="info-page-container">
            <h2>Thông tin cá nhân</h2>

            <div className="info-avatar">
                <img
                    src="/default-avatar.png"
                    alt="Avatar"
                    className="avatar-preview"
                />
                <input type="file" accept="image/*" />
            </div>

            <div className="info-section">
                <label>Email:</label>
                <input type="text" placeholder="student@example.com" disabled value ={user.account.username } />
            </div>

            <div className="info-section">
                <label>Họ và tên:</label>
                <input type="text" placeholder="Nguyễn Văn A" disabled value={user.account.HoTen} />
            </div>

            <h3>Đổi mật khẩu</h3>

            <div className="info-section">
                <label>Mật khẩu hiện tại:</label>
                <input 
                type="password" 
                placeholder="Nhập mật khẩu cũ" 
                value ={oldPassword}
                onChange = {(e)=> handleChangePassword(e,'oldPassword')} />
            </div>

            <div className="info-section">
                <label>Mật khẩu mới:</label>
                <input 
                type="password" 
                placeholder="Nhập mật khẩu mới" 
                value={newPassword}  
                onChange={(e) => handleChangePassword(e, 'newPassword')}
                />
            </div>

            <div className="info-section">
                <label>Nhập lại mật khẩu mới:</label>
                <input type="password"
                 placeholder="Nhập lại mật khẩu mới"
                 value={confirmNewPassword}
                 onChange={(e) => handleChangePassword(e, 'confirmNewPassword')}
                />
            </div>

            <button className="btn-save" onClick ={UpdatePassword}>Đổi mật khẩu</button>
        </div>
    );
};

export default InfoPage;
