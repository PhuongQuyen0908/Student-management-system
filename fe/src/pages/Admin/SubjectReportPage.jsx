import React from 'react';
import '../../styles/Page/SubjectReportPage.scss'
import SubjectReportTable from '../../components/Table/SubjectReportTable';
import '../../styles/FilterGroup.scss';
const SubjectReportPage = () => {
    return (
        <div className="subjectreport-page-container">
            <div className="subjectreport-header">
                <h2 className="subjectreport-title">Báo cáo tổng kết môn</h2>
                <div className="filter-group">
                    <select>
                        <option>Toán</option>
                        <option>Lý</option>
                    </select>
                    <select>
                        <option>Học kỳ 1</option>
                        <option>Học kỳ 2</option>
                    </select>
                </div>
            </div>
            <SubjectReportTable />
        </div>
    );
};

export default SubjectReportPage;
