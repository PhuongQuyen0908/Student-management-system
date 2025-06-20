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
  faClipboardList,
  faSchoolCircleCheck,
  faScaleBalanced,
  faSchoolFlag,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import useTaskbar from '../../hooks/useTaskbar';
import logo from '../../assets/School-logo.png';




const Taskbar = () => {
  //vẫn thiếu phần ẩn hiện về lớp fix sau 07/06/2025

  const { expandedMenus, toggleMenu, handleLogout, isAvailable } = useTaskbar();
  //isAvailable là object chứa quyết định xem có hiện trang đó hay không
  //isAvailable = { DanhSachHocSinh: true,...} là hiện trang Danh sách học sinh

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

        {(isAvailable.DanhSachHocSinh || isAvailable.TiepNhanHocSinh) && (
          <>
            <NavLink className="taskbar-item" onClick={() => toggleMenu('studentManagement')}>
              <FontAwesomeIcon icon={faGraduationCap} /> Học sinh
              <FontAwesomeIcon
                icon={expandedMenus.studentManagement ? faChevronDown : faChevronRight}
                className="menu-arrow"
              />
            </NavLink>
            {expandedMenus.studentManagement && (
              <div className="submenu">
                {isAvailable.DanhSachHocSinh &&  //ẩn nếu k có quyền vào
                  <NavLink
                    to="/admin/students"
                    className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
                  >
                    Danh sách học sinh
                  </NavLink>
                }

                {isAvailable.TiepNhanHocSinh &&  //ẩn nếu k có quyền vào}
                  <NavLink
                    to="/admin/studentadmission"
                    className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
                  >
                    Tiếp nhận học sinh
                  </NavLink>
                }
              </div>
            )}
          </>
        )}

        {(isAvailable.DanhSachMonHoc || isAvailable.BangDiemMonHoc || isAvailable.LoaiKiemTra) && (
          <>
            <NavLink className="taskbar-item" onClick={() => toggleMenu('subjectManagement')}>
              <FontAwesomeIcon icon={faBookOpen} /> Môn học
              <FontAwesomeIcon
                icon={expandedMenus.subjectManagement ? faChevronDown : faChevronRight}
                className="menu-arrow"
              />
            </NavLink>
            {expandedMenus.subjectManagement && (
              <div className="submenu">
                {isAvailable.DanhSachMonHoc &&  //ẩn nếu k có quyền vào
                  <NavLink
                    to="/admin/subjects"
                    className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
                  >
                    Danh sách môn học
                  </NavLink>
                }
                {isAvailable.BangDiemMonHoc &&  //ẩn nếu k có quyền vào
                  <NavLink
                    to="/admin/subjectgrades"
                    className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
                  >
                    Bảng điểm môn học
                  </NavLink>
                }
                {isAvailable.LoaiKiemTra &&
                  <NavLink
                    to="/admin/testtype"
                    className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
                  >
                    Loại kiểm tra
                  </NavLink>
                }
              </div>
            )}
          </>
        )}
        {(isAvailable.QuanLyLopHoc || isAvailable.DanhSachLop) && (
          <>
            <NavLink className="taskbar-item" onClick={() => toggleMenu('classManagement')}>
              <FontAwesomeIcon icon={faSchool} /> Lớp học
              <FontAwesomeIcon
                icon={expandedMenus.classManagement ? faChevronDown : faChevronRight}
                className="menu-arrow"
              />
            </NavLink>
            {expandedMenus.classManagement && (
              <div className="submenu">
                {isAvailable.QuanLyLopHoc &&  //ẩn nếu k có quyền vào}
                  <NavLink
                    to="/admin/classmanagement"
                    className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
                  >
                    Quản lý lớp học
                  </NavLink>
                }
                {isAvailable.DanhSachLop &&
                  <NavLink
                    to="/admin/classlist"
                    className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
                  >
                    Danh sách lớp
                  </NavLink>
                }
              </div>
            )}
          </>
        )}

        {isAvailable.QuanLyKhoiLop &&
          <NavLink
            to="/admin/grademanagement"
            className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}
          >
            <FontAwesomeIcon icon={faSchoolFlag} /> Quản lý khối lớp
          </NavLink>
        }

        {isAvailable.QuanLyNamHoc &&
          <NavLink
            to="/admin/schoolyears"
            className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}
          >
            <FontAwesomeIcon icon={faCalendarAlt} /> Quản lý năm học
          </NavLink>
        }
        
        {(isAvailable.BaoCaoMonHoc || isAvailable.BaoCaoHocKy) && (
          <>
            <NavLink className="taskbar-item" onClick={() => toggleMenu('reportManagement')}>
              <FontAwesomeIcon icon={faChartBar} /> Báo cáo
              <FontAwesomeIcon
                icon={expandedMenus.reportManagement ? faChevronDown : faChevronRight}
                className="menu-arrow"
              />
            </NavLink>
            {expandedMenus.reportManagement && (
              <div className="submenu">
                {isAvailable.BaoCaoMonHoc &&
                  <NavLink
                    to="/admin/subjectreport"
                    className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
                  >
                    Báo cáo tổng kết môn
                  </NavLink>
                }

                {isAvailable.BaoCaoHocKy &&
                  <NavLink
                    to="/admin/semesterreport"
                    className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
                  >
                    Báo cáo tổng kết học kỳ
                  </NavLink>
                }
              </div>
            )}
          </>
        )}

        {isAvailable.ThayDoiQuyDinh &&  //ẩn nếu k có quyền vào
          <NavLink
            to="/admin/ruleschange"
            className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}
          >
            <FontAwesomeIcon icon={faClipboardList} /> Thay đổi quy định
          </NavLink>
        }
      </div>

      <div className="taskbar-section">
        <p className="section-title">KHÁC</p>

        {(isAvailable.QuanLyTaiKhoan || isAvailable.QuanLyPhanQuyen) && (
          <>
            <NavLink className="taskbar-item" onClick={() => toggleMenu('settingManagement')}>
              <FontAwesomeIcon icon={faCog} /> Cài đặt
              <FontAwesomeIcon
                icon={expandedMenus.settingManagement ? faChevronDown : faChevronRight}
                className="menu-arrow"
              />
            </NavLink>
            {expandedMenus.settingManagement && (
              <div className="submenu">
                {isAvailable.QuanLyTaiKhoan &&  //ẩn nếu k có quyền vào
                  <NavLink
                    to="/admin/accountmanagement"
                    className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
                  >
                    Quản lý tài khoản
                  </NavLink>
                }

                {isAvailable.QuanLyPhanQuyen &&  //ẩn nếu k có quyền vào}
                  <NavLink
                    to="/admin/decentralization"
                    className={({ isActive }) => `taskbar-subitem ${isActive ? 'active-taskbar' : ''}`}
                  >
                    Quản lý phân quyền
                  </NavLink>
                }
              </div>
            )}
          </>
        )}

        <NavLink
          to="/admin/info"
          className={({ isActive }) => `taskbar-item ${isActive ? 'active-taskbar' : ''}`}
        >
          <FontAwesomeIcon icon={faUser} /> Hồ sơ
        </NavLink>
        <div className="taskbar-item" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
        </div>
      </div>
    </nav >
  );
};

export default Taskbar;
