import React from 'react';
import ClassListTable from '../../components/Table/ClassListTable'
import '../../styles/Page/ClassesListPage.scss'
const ClassesListPage = () => {
    return (
        <div className="classeslist-page-container">
            <h2 className="classeslist-title">Danh sách lớp</h2>
            <ClassListTable />
        </div>
    );
};

export default ClassesListPage;
