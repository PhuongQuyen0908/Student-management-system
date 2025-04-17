import { useState } from 'react';

const useTaskbar = () => {
  const [expandedMenus, setExpandedMenus] = useState({
    classManagement: false,
    subjectManagement: false,
    reportManagement: false,
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
