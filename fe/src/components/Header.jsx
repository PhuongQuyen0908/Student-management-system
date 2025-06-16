import React from 'react';
import '../styles/Header.scss';
import {useContext} from 'react';
import { UserContext } from '../context/UserContext';
const Header = () => {
    const { user } = useContext(UserContext);
    return (
        <header className="header">
            <div className="user-info">
                <div className="user-details">
                    <p className="user-name">{user.account.HoTen}</p>
                    <p className="user-role">{user.account.groupWithPermissions.TenNhom}</p>
                </div>
                <div className="avatar">
                    {user.account.Avatar ? (
                        <img src={user.account.Avatar} alt="User Avatar" className="avatar-image" />
                    ) : (
                        <div className="default-avatar">A</div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
