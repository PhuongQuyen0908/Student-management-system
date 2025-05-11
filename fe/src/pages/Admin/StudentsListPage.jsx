import React from 'react';
import '../../styles/Page/StudentsListPage.scss'
import StudentListTable from '../../components/Table/StudentListTable';

const StudentsListPage = () => {
    return (
        <div className="studentslist-page-container">
            <div className="studentslist-header">
                <h2 className="studentslist-title">Danh sách lớp</h2>
                <div className="filter-group">
                    <select>
                        <option>2023 - 2024</option>
                        <option>2022 - 2023</option>
                    </select>
                </div>
            </div>
            <StudentListTable />
        </div>
    );
};

export default StudentsListPage;
