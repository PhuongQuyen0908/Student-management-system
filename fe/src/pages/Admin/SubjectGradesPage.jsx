import React, { useState } from 'react';
import SubjectGradeTable from '../../components/Table/SubjectGradeTable';
import '../../styles/Page/SubjectGradesPage.scss';

const SubjectGradesPage = () => {
    const [filters, setFilters] = useState({
        year: '',
        class: '',
        subject: '',
        semester: ''
    });

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    return (
        <div className="subjectgrades-page-container">
            <div className="subjectgrades-header">
                <h2 className="subjectgrades-title">Bảng điểm môn học</h2>
                <div className="filter-group">
                    <select onChange={(e) => handleFilterChange('year', e.target.value)}>
                        <option value="">2024 - 2025</option>
                        <option value="2023-2024">2023 - 2024</option>
                    </select>
                    <select onChange={(e) => handleFilterChange('class', e.target.value)}>
                        <option value="">10A1</option>
                        <option value="10A1">10A2</option>
                    </select>
                    <select onChange={(e) => handleFilterChange('subject', e.target.value)}>
                        <option value="">Văn</option>
                        <option value="Toán">Toán</option>
                    </select>
                    <select onChange={(e) => handleFilterChange('semester', e.target.value)}>
                        <option value="">Học kỳ 2</option>
                        <option value="1">Học kỳ 1</option>
                    </select>
                </div>
            </div>
            <SubjectGradeTable />
        </div>
    );
};

export default SubjectGradesPage;
