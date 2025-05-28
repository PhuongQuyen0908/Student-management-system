import '../../styles/Page/InfoPage.scss';

const InfoPage = () => {
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
                <input type="text" placeholder="student@example.com" disabled />
            </div>

            <div className="info-section">
                <label>Họ và tên:</label>
                <input type="text" placeholder="Nguyễn Văn A" disabled />
            </div>

            <h3>Đổi mật khẩu</h3>

            <div className="info-section">
                <label>Mật khẩu hiện tại:</label>
                <input type="password" placeholder="Nhập mật khẩu cũ" />
            </div>

            <div className="info-section">
                <label>Mật khẩu mới:</label>
                <input type="password" placeholder="Nhập mật khẩu mới" />
            </div>

            <div className="info-section">
                <label>Nhập lại mật khẩu mới:</label>
                <input type="password" placeholder="Nhập lại mật khẩu mới" />
            </div>

            <button className="btn-save">Đổi mật khẩu</button>
        </div>
    );
};

export default InfoPage;
