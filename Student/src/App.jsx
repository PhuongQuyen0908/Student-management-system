import { useState } from 'react'
import React from "react";
import './App.scss'
import { ToastContainer, toast } from 'react-toastify';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import Login from './components/Login/Login.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

import ModalAddStudent from './components/Modal/ModalAddStudent.jsx';
import ModalUpdateStudent from './components/Modal/ModalUpdateStudent.jsx';
import Taskbar from './components/Taskbar/Taskbar.jsx';
function App() {

  return (
    <Router>
      <div className="app-container">
        {/* App Route */}
        <Taskbar/>
        <ModalAddStudent />
        <ModalUpdateStudent />
        <AppRoutes />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  )
}

export default App
