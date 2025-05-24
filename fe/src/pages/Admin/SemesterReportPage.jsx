import React from 'react';
import '../../styles/Page/SemesterReportPage.scss';
import SemesterReportTable from '../../components/Table/SemesterReportTable';
import '../../styles/FilterGroup.scss';
const SemesterReportPage = () => {
    return (
        <div className="semesterreport-page-container">
            <div className="semesterreport-header">
                <h2 className="semesterreport-title">Báo cáo tổng kết học kỳ</h2>
                <div className="filter-group">
                    <select>
                        <option>Học kỳ 1</option>
                        <option>Học kỳ 2</option>
                    </select>
                </div>
            </div>
            <SemesterReportTable />
        </div>
    );
};

export default SemesterReportPage;
