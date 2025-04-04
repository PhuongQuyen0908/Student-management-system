import React from 'react';
import './Taskbar.scss';
import { Nav } from 'react-bootstrap';
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
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faHome} /> Dashboard
        </Nav.Link>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faUserTie} /> Teachers
        </Nav.Link>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faGraduationCap} /> Students
        </Nav.Link>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faBookOpen} /> Subjects
        </Nav.Link>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faSchool} /> Classes
        </Nav.Link>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faUserFriends} /> Parents
        </Nav.Link>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faChartBar} /> Reports
        </Nav.Link>
      </div>
      <div className="taskbar-section">
        <p className="section-title">OTHER</p>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faCog} /> Setting
        </Nav.Link>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faUser} /> Profile
        </Nav.Link>
        <Nav.Link className="taskbar-item">
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </Nav.Link>
      </div>
    </nav>
  );
};

export default Taskbar;