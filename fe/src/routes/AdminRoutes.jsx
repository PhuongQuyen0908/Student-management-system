import AdminPage from '../pages/Admin/AdminPage'
import StudentsPage from '../pages/Admin/StudentsPage'

const AdminRoutes = {
    path: '/admin',
    element: <AdminPage />,
    children: [
        {
            path: 'students',
            element: <StudentsPage />,
        },
    ],
};

export default AdminRoutes;
