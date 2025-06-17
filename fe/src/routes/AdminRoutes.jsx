import AdminPage from '../pages/Admin/AdminPage'
import ClassesPage from '../pages/Admin/ClassesPage';
import StudentsPage from '../pages/Admin/StudentsPage'
import SubjectsPage from '../pages/Admin/SubjectsPage'
import ClassesListPage from '../pages/Admin/ClassesListPage';
import SubjectGradesPage from '../pages/Admin/SubjectGradesPage';
import StudentsListPage from '../pages/Admin/StudentsListPage';
import SubjectReportPage from '../pages/Admin/SubjectReportPage';
import SemesterReportPage from '../pages/Admin/SemesterReportPage';
import RulesChangePage from '../pages/Admin/RulesChangePage';
import HomePage from '../pages/Admin/HomePage';
import InfoPage from '../pages/Admin/InfoPage';
import AccountsPage from '../pages/Admin/AccountsPage';
import DecentralizationPage from '../pages/Admin/DecentralizationPage';
//import 04/06/2025
import PrivateRoutes from './PrivateRoutes';
import GradesPage from '../pages/Admin/GradesPage';
import TestTypePage from '../pages/Admin/TestTypePage';
import SchoolYearsPage from '../pages/Admin/SchoolYearsPage';
const AdminRoutes = {
    path: '/admin',
    element: (
        <PrivateRoutes element={<AdminPage />} />
    ),
    children: [
        {
            path: 'home',
            element: <HomePage />,
        },

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
        {
            path: 'ruleschange',
            element: <RulesChangePage />,
        },
        {
            path: 'info',
            element: <InfoPage />,
        },
        {
            path: 'accountmanagement',
            element: <AccountsPage />,
        },

        {
            path: 'decentralization',
            element: <DecentralizationPage />,
        },
        {
            path: 'grademanagement',
            element: <GradesPage />,
        },
        {
            path: 'testtype',
            element: <TestTypePage />,
        },
        {
            path: 'schoolyears',
            element: <SchoolYearsPage />,
        }
    ],
};

export default AdminRoutes;
