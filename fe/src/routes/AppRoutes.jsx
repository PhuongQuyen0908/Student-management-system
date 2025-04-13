import { useRoutes } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import Login1 from '../pages/Login/LoginPage1';

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
