import { useRoutes } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';

const AppRoutes = () => {
    const routes = [
        // {
        //     path: '/login1',
        //     element: <Login1 />
        // },
        // {
        //     path: '/login',
        //     element: <Login />
        // },
        // {
        //     path: '/',
        //     element: <h1>Home</h1>
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
