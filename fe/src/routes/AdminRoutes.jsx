import AdminPage from '../pages/Admin/AdminPage'
import ClassesPage from '../pages/Admin/ClassesPage';
import StudentsPage from '../pages/Admin/StudentsPage'
import ClassesListPage from '../pages/Admin/ClassesListPage';
const AdminRoutes = {
    path: '/admin',
    element: <AdminPage />,
    children: [
        {
            path: 'students',
            element: <StudentsPage />,
        },
        {
            path: 'classmanagement',
            element: <ClassesPage />,
        },
        {
            path: 'classlist',
            element: <ClassesListPage />,
        },
    ],
};

export default AdminRoutes;
