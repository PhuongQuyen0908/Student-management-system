import React from 'react';
import Login1 from '../pages/Login/LoginPage1.jsx'
import Login from '../pages/Login/LoginPage.jsx'

import PrivateRoutes from './PrivateRoutes.jsx';
import { Routes, Route } from 'react-router-dom'


const AppRoutes = props => {
    return (
        <div>
            <Routes>
                {/* private route */}

                {/* routes */}
                <Route path="/login1" element={<Login1></Login1>} />
                <Route path="/login" element={<Login></Login>} />
                <Route path="/" element={<h1>Home</h1>} />
                <Route path="*" element={<h1>404 not found</h1>} />
            </Routes>
        </div>
    );
};

export default AppRoutes;