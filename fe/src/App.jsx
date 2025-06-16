/* eslint-disable no-unused-vars */
import { useState } from "react";
import React from "react";
import "./App.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login/LoginPage.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { FaSpinner } from 'react-icons/fa';
import "./styles/Spinner.scss"

import ModalAddStudent from "./components/Modal/ModalAddStudent.jsx";
import ModalUpdateStudent from "./components/Modal/ModalUpdateStudent.jsx";
import Taskbar from "./components/Taskbar/Taskbar.jsx";
import Login1 from "./pages/Login/LoginPage1.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import AdminRoutes from "./routes/AdminRoutes.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";
import StudentsPage from "./pages/Admin/StudentsPage.jsx";
import { Toast } from "bootstrap";

//mới
import { UserContext } from './context/UserContext';
import { useContext } from 'react';

function App() {
  const { user } = useContext(UserContext);
  console.log("User context in App:", user);
  return (
    <>
      {user && user.isLoading === true ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
          <FaSpinner className="spinner" size={40} />
          <p style={{ marginTop: '10px' }}>Đang tải...</p>
          <ToastContainer />
        </div>
      )
        :
        // <Router>
        //   <div className="app-container">
        //     {/* App Route */}
        //     <Taskbar/>
        //     <ModalAddStudent />
        //     <ModalUpdateStudent />
        //     <AppRoutes />
        //   </div>
        //   
        // </Router>
        <div>
          <ToastContainer />
          <AppRoutes></AppRoutes>
        </div>
      }
    </>
  );
}

export default App;
