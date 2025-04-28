import React from 'react';
import StudentTable from '../../components/StudentTable';
import '../../styles/StudentsPage.scss'

const StudentsPage = () => {
    return (
        <div className="students-page-container">
            <h2 className="students-title">Danh sách học sinh</h2>
            <StudentTable />
        </div>
    );
};

export default StudentsPage;
