import React from 'react';
import '../../styles/Taskbar.scss';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUserTie,
  faGraduationCap,
  faBookOpen,
  faSchool,
  faUserFriends,
  faChartBar,
  faCog,
  faUser,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

const Taskbar = () => {
  return (
    <nav className="taskbar-container">
      <div className="taskbar-header">
        <h3>Group6 - CSSE</h3>
      </div>
      <div className="taskbar-section">
        <p className="section-title">MENU</p>
        <NavLink to="/admin" end className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}>
          <FontAwesomeIcon icon={faHome} /> Dashboard
        </NavLink>
        <NavLink to="/admin/teachers" className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}>
          <FontAwesomeIcon icon={faUserTie} /> Teachers
        </NavLink>
        <NavLink to="/admin/students" className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}>
          <FontAwesomeIcon icon={faGraduationCap} /> Students
        </NavLink>
        <NavLink to="/admin/subjects" className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}>
          <FontAwesomeIcon icon={faBookOpen} /> Subjects
        </NavLink>
        <NavLink to="/admin/classes" className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}>
          <FontAwesomeIcon icon={faSchool} /> Classes
        </NavLink>
        <NavLink to="/admin/parents" className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}>
          <FontAwesomeIcon icon={faUserFriends} /> Parents
        </NavLink>
        <NavLink to="/admin/reports" className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}>
          <FontAwesomeIcon icon={faChartBar} /> Reports
        </NavLink>
      </div>
      <div className="taskbar-section">
        <p className="section-title">OTHER</p>
        <NavLink to="/admin/settings" className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}>
          <FontAwesomeIcon icon={faCog} /> Setting
        </NavLink>
        <NavLink to="/admin/profile" className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}>
          <FontAwesomeIcon icon={faUser} /> Profile
        </NavLink>
        <NavLink to="/logout" className="taskbar-item">
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </NavLink>
      </div>
    </nav>
  );
};

export default Taskbar;
