import { useState } from 'react';

const useTaskbar = () => {
  const [expandedMenus, setExpandedMenus] = useState({
    studentManagement: false,
    classManagement: false,
    subjectManagement: false,
    reportManagement: false,
    systemSettings: false,
    teacherManagement: false,
  });

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return {
    expandedMenus,
    toggleMenu,
  };
};

export default useTaskbar;
