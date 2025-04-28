import AdminPage from '../pages/Admin/AdminPage'
import ClassesPage from '../pages/Admin/ClassesPage';
import StudentsPage from '../pages/Admin/StudentsPage'
import SubjectsPage from '../pages/Admin/SubjectsPage'

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
        {
            path: 'subjects',
            element: <SubjectsPage />,
        },
    ],
};

export default AdminRoutes;
