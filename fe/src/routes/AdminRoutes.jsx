import AdminPage from '../pages/Admin/AdminPage'
import ClassesPage from '../pages/Admin/ClassesPage';
import StudentsPage from '../pages/Admin/StudentsPage'

const AdminRoutes = {
    path: '/admin',
    element: <AdminPage />,
    children: [
        {
            path: 'students',
            element: <StudentsPage />,
        },
        {
            path: 'classes',
            element: <ClassesPage />,
        },
    ],
};

export default AdminRoutes;
