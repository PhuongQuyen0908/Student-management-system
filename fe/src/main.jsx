import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
// 04/06/2025
import { UserProvider } from './context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserProvider>
  //</StrictMode>
);
