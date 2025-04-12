import React from 'react';
import '../styles/Header.scss';

const Header = () => {
    return (
        <header className="header">
            <div className="user-info">
                <div className="user-details">
                    <p className="user-name">Nguyễn Phương Quyên</p>
                    <p className="user-role">admin</p>
                </div>
                <div className="avatar">
                    A
                </div>
            </div>
        </header>
    );
};

export default Header;
