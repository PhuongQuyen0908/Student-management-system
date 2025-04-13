import { useRoutes } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import Login1 from '../pages/Login/LoginPage1';
import ForgotPasswordPage from '../pages/Login/ForgotPasswordPage';

const AppRoutes = () => {
    const routes = [
        {
            path: '/',
            element: <Login1 />
        },
        // {
        //     path: '/',
        //     element: <Home />
        // },
        {
            path: '/forgot-password',
            element: <ForgotPasswordPage />
        },
        AdminRoutes,
        {
            path: '*',
            element: <h1>404 not found</h1>
        }
    ];

    const element = useRoutes(routes);
    return element;
};

export default AppRoutes;
