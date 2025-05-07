import AdminPage from '../pages/Admin/AdminPage'
import ClassesPage from '../pages/Admin/ClassesPage';
import StudentsPage from '../pages/Admin/StudentsPage'
import SubjectsPage from '../pages/Admin/SubjectsPage'
import ClassesListPage from '../pages/Admin/ClassesListPage';
import SubjectGradesPage from '../pages/Admin/SubjectGradesPage';
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
            path: 'subjects',
            element: <SubjectsPage />,
        },
        {
            path: 'classlist',
            element: <ClassesListPage />,
        },
        {
            path: 'subjectgrades',
            element: <SubjectGradesPage />,
        },
    ],
};

export default AdminRoutes;
