import React from 'react';
import '../../styles/Taskbar.scss';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faGraduationCap,
  faBookOpen,
  faSchool,
  faChartBar,
  faCog,
  faUser,
  faSignOutAlt,
  faChevronDown,
  faChevronRight,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import useTaskbar from '../../hooks/useTaskbar';
import logo from '../../assets/School-logo.png';

const Taskbar = () => {
  const { expandedMenus, toggleMenu } = useTaskbar();

  return (
    <nav className="taskbar-container">
      <div className="taskbar-header">
        <img src={logo} alt="Group6 Logo" className="header-logo" />
        <h3>Group6 - CSSE</h3>
      </div>

      <div className="taskbar-section">
        <p className="section-title">MENU</p>

        <NavLink to="/admin/home" end className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}>
          <FontAwesomeIcon icon={faHome} /> Trang chủ
        </NavLink>

        <NavLink className="taskbar-item" onClick={() => toggleMenu('studentManagement')}>
          <FontAwesomeIcon icon={faGraduationCap} /> Học sinh
          <FontAwesomeIcon
            icon={expandedMenus.studentManagement ? faChevronDown : faChevronRight}
            className="menu-arrow"
          />
        </NavLink>
        {expandedMenus.studentManagement && (
          <div className="submenu">
            <NavLink
              to="/admin/students"
              className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
            >
              Danh sách học sinh
            </NavLink>
            <NavLink
              to="/admin/studentadmission"
              className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
            >
              Tiếp nhận học sinh
            </NavLink>
          </div>
        )}

        <NavLink className="taskbar-item" onClick={() => toggleMenu('subjectManagement')}>
          <FontAwesomeIcon icon={faBookOpen} /> Môn học
          <FontAwesomeIcon
            icon={expandedMenus.subjectManagement ? faChevronDown : faChevronRight}
            className="menu-arrow"
          />
        </NavLink>
        {expandedMenus.subjectManagement && (
          <div className="submenu">
            <NavLink
              to="/admin/subjects"
              className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
            >
              Danh sách môn học
            </NavLink>
            <NavLink
              to="/admin/subjectgrades"
              className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
            >
              Bảng điểm môn học
            </NavLink>
          </div>
        )}

        <NavLink className="taskbar-item" onClick={() => toggleMenu('classManagement')}>
          <FontAwesomeIcon icon={faSchool} /> Lớp học
          <FontAwesomeIcon
            icon={expandedMenus.classManagement ? faChevronDown : faChevronRight}
            className="menu-arrow"
          />
        </NavLink>
        {expandedMenus.classManagement && (
          <div className="submenu">
            <NavLink
              to="/admin/classmanagement"
              className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
            >
              Quản lý lớp học
            </NavLink>
            <NavLink
              to="/admin/classlist"
              className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
            >
              Danh sách lớp
            </NavLink>
          </div>
        )}

        <NavLink className="taskbar-item" onClick={() => toggleMenu('reportManagement')}>
          <FontAwesomeIcon icon={faChartBar} /> Báo cáo
          <FontAwesomeIcon
            icon={expandedMenus.reportManagement ? faChevronDown : faChevronRight}
            className="menu-arrow"
          />
        </NavLink>
        {expandedMenus.reportManagement && (
          <div className="submenu">
            <NavLink
              to="/admin/subjectreport"
              className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
            >
              Báo cáo tổng kết môn
            </NavLink>
            <NavLink
              to="/admin/semesterreport"
              className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
            >
              Báo cáo tổng kết học kỳ
            </NavLink>
          </div>
        )}

        <NavLink
          to="/admin/ruleschange"
          className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}
        >
          <FontAwesomeIcon icon={faClipboardList} /> Thay đổi quy định
        </NavLink>
      </div>

      <div className="taskbar-section">
        <p className="section-title">KHÁC</p>

        <NavLink className="taskbar-item" onClick={() => toggleMenu('settingManagement')}>
          <FontAwesomeIcon icon={faCog} /> Cài đặt
          <FontAwesomeIcon
            icon={expandedMenus.settingManagement ? faChevronDown : faChevronRight}
            className="menu-arrow"
          />
        </NavLink>
        {expandedMenus.settingManagement && (
          <div className="submenu">
            <NavLink
              to="/admin/accountmanagement"
              className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
            >
              Quản lý tài khoản
            </NavLink>
            <NavLink
              to="/admin/dencentralization"
              className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
            >
              Phân quyền
            </NavLink>
          </div>
        )}
        <NavLink
          to="/admin/info"
          className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}
        >
          <FontAwesomeIcon icon={faUser} /> Hồ sơ
        </NavLink>
        <NavLink to="/logout" className="taskbar-item">
          <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
        </NavLink>
      </div>
    </nav>
  );
};

export default Taskbar;
