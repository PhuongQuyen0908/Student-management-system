import AdminPage from '../pages/Admin/AdminPage'
import StudentsPage from '../pages/Admin/StudentsPage'
import SubjectReportPage from '../pages/SubjectReportPage';


const AdminRoutes = {
    path: '/admin',
    element: <AdminPage />,
    children: [
        {
            path: 'students',
            element: <StudentsPage />,
        },
        {
            path: 'reports/subject-summary',    // ⚡ Đường dẫn cần thêm
            element: <SubjectReportPage />,      // ⚡ Trang tổng kết môn học
        },
    ],
};

export default AdminRoutes;
