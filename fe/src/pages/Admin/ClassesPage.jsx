import React from 'react';
import ClassTable from '../../components/ClassTable';
import '../../styles/ClassesPage.scss'

const ClassesPage = () => {
    return (
        <div className="classes-page-container">
            <h2 className="classes-title">Danh sách lớp học</h2>
            <ClassTable />
        </div>
    );
};

export default ClassesPage;
