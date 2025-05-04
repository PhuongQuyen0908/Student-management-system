import React from 'react';
import ClassListTable from '../../components/Table/ClassListTable';
import '../../styles/Page/ClassesListPage.scss';

const ClassesListPage = () => {
    return (
        <div className="classeslist-page-container">
            <div className="classeslist-header">
                <h2 className="classeslist-title">Danh sách lớp</h2>
                <div className="filter-group">
                    <select>
                        <option>2023 - 2024</option>
                        <option>2022 - 2023</option>
                    </select>
                    <select>
                        <option>Lớp 10A1</option>
                        <option>Lớp 10A2</option>
                    </select>
                    <input type="text" value="40" readOnly />
                </div>
            </div>
            <ClassListTable />
        </div>
    );
};

export default ClassesListPage;
