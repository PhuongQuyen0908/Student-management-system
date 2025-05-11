import AdminPage from '../pages/Admin/AdminPage'
import ClassesPage from '../pages/Admin/ClassesPage';
import StudentsPage from '../pages/Admin/StudentsPage'
import SubjectsPage from '../pages/Admin/SubjectsPage'
import ClassesListPage from '../pages/Admin/ClassesListPage';
import SubjectGradesPage from '../pages/Admin/SubjectGradesPage';
import StudentsListPage from '../pages/Admin/StudentsListPage';
import SubjectReportPage from '../pages/Admin/SubjectReportPage';
import SemesterReportPage from '../pages/Admin/SemesterReportPage';
const AdminRoutes = {
    path: '/admin',
    element: <AdminPage />,
    children: [
        {
            path: 'studentadmission',
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
        {
            path: 'students',
            element: <StudentsListPage />,
        },
        {
            path: 'subjectreport',
            element: <SubjectReportPage />,
        },
        {
            path: 'semesterreport',
            element: <SemesterReportPage />,
        },
    ],
};

export default AdminRoutes;
