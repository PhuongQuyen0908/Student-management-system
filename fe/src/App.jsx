import { useState } from 'react'
import React from "react";
import './App.scss'
import { ToastContainer, toast } from 'react-toastify';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import Login from './pages/Login/LoginPage.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

import ModalAddStudent from './components/Modal/ModalAddStudent.jsx';
import ModalUpdateStudent from './components/Modal/ModalUpdateStudent.jsx';
import Taskbar from './components/Taskbar/Taskbar.jsx';
import Login1 from './pages/Login/LoginPage1.jsx';
import AdminPage from './pages/Admin/AdminPage.jsx';
import AdminRoutes from './routes/AdminRoutes.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import StudentsPage from './pages/Admin/StudentsPage.jsx';
function App() {

  return (
    // <Router>
    //   <div className="app-container">
    //     {/* App Route */}
    //     <Taskbar/>
    //     <ModalAddStudent />
    //     <ModalUpdateStudent />
    //     <AppRoutes />
    //   </div>
    //   <ToastContainer
    //     position="top-right"
    //     autoClose={5000}
    //     hideProgressBar={false}
    //     newestOnTop={false}
    //     rtl={false}
    //     pauseOnFocusLoss
    //     draggable
    //     pauseOnHover
    //   />
    // </Router>
    <AppRoutes></AppRoutes>
  )
}

export default App
