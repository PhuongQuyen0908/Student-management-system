import React, { useState } from 'react';
import '../../styles/Taskbar.scss';
import logo from '../../assets/School-logo.png';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUserTie,
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

const Taskbar = () => {
  const [expandedMenus, setExpandedMenus] = useState({
    studentManagement: false,
    classManagement: false,
    subjectManagement: false,
    reportManagement: false,
    systemSettings: false,
    teacherManagement: false
  });

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <nav className="taskbar-container">
      <div className="taskbar-header">
        <img src={logo} alt="Group6 Logo" className="header-logo" />
        <h3>Nhóm 6 - CSSE</h3>
      </div>

      <div className="taskbar-section">
        <p className="section-title">MENU CHÍNH</p>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faHome} /> Trang chủ
        </Nav.Link>
        <Nav.Link className="taskbar-item" onClick={() => toggleMenu('teacherManagement')}>
          <FontAwesomeIcon icon={faUserTie} /> Quản lý giáo viên
          <FontAwesomeIcon
            icon={expandedMenus.teacherManagement ? faChevronDown : faChevronRight}
            className="menu-arrow"
          />
        </Nav.Link>
        {expandedMenus.teacherManagement && (
          <div className="submenu">
            <Nav.Link className="taskbar-subitem">Phân công giảng dạy</Nav.Link>
          </div>
        )}

        <Nav.Link className="taskbar-item" onClick={() => toggleMenu('studentManagement')}>
          <FontAwesomeIcon icon={faGraduationCap} /> Quản lý học sinh
          <FontAwesomeIcon
            icon={expandedMenus.studentManagement ? faChevronDown : faChevronRight}
            className="menu-arrow"
          />
        </Nav.Link>
        {expandedMenus.studentManagement && (
          <div className="submenu">
            <Nav.Link className="taskbar-subitem">Tiếp nhận học sinh</Nav.Link>
            <Nav.Link className="taskbar-subitem">Tra cứu học sinh</Nav.Link>
          </div>
        )}

        <Nav.Link className="taskbar-item" onClick={() => toggleMenu('subjectManagement')}>
          <FontAwesomeIcon icon={faBookOpen} /> Quản lý môn học
          <FontAwesomeIcon
            icon={expandedMenus.subjectManagement ? faChevronDown : faChevronRight}
            className="menu-arrow"
          />
        </Nav.Link>
        {expandedMenus.subjectManagement && (
          <div className="submenu">
            <Nav.Link className="taskbar-subitem">Nhận bảng điểm môn</Nav.Link>
            <Nav.Link className="taskbar-subitem">Tạo môn học</Nav.Link>
          </div>
        )}

        <Nav.Link className="taskbar-item" onClick={() => toggleMenu('classManagement')}>
          <FontAwesomeIcon icon={faSchool} /> Quản lý lớp học
          <FontAwesomeIcon
            icon={expandedMenus.classManagement ? faChevronDown : faChevronRight}
            className="menu-arrow"
          />
        </Nav.Link>
        {expandedMenus.classManagement && (
          <div className="submenu">
            <Nav.Link className="taskbar-subitem">Lập danh sách lớp</Nav.Link>
            <Nav.Link className="taskbar-subitem">Tạo lớp</Nav.Link>
          </div>
        )}


        <Nav.Link className="taskbar-item" onClick={() => toggleMenu('reportManagement')}>
          <FontAwesomeIcon icon={faChartBar} /> Báo cáo
          <FontAwesomeIcon
            icon={expandedMenus.reportManagement ? faChevronDown : faChevronRight}
            className="menu-arrow"
          />
        </Nav.Link>
        {expandedMenus.reportManagement && (
          <div className="submenu">
            <Nav.Link className="taskbar-subitem">Lập báo cáo tổng kết môn</Nav.Link>
            <Nav.Link className="taskbar-subitem">Lập báo cáo tổng kết học kỳ</Nav.Link>
            <Nav.Link className="taskbar-subitem">Lập báo cáo kết quả học tập</Nav.Link>
          </div>
        )}

        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faClipboardList} /> Thay đổi quy định
        </Nav.Link>
      </div>

      <div className="taskbar-section">
        <p className="section-title">KHÁC</p>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faCog} /> Cài đặt
        </Nav.Link>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faUser} /> Hồ sơ
        </Nav.Link>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
        </Nav.Link>
      </div>
    </nav>
  );
};

export default Taskbar;