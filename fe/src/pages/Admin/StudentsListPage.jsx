import React from 'react';
import '../../styles/Page/StudentsListPage.scss'
import StudentListTable from '../../components/Table/StudentListTable';
//các import mới
import { useState, useEffect } from 'react';
import useStudentListPage from '../../hooks/useStudentListPage';
import '../../styles/FilterGroup.scss';
const StudentsListPage = () => {

    const { years, selectedYear, setSelectedYear, fetchYears } = useStudentListPage();
    useEffect(() => {
        fetchYears();
    }, [])

    return (
        <div className="studentslist-page-container">
            <div className="studentslist-header">
                <h2 className="studentslist-title">Danh sách lớp</h2>
                <div className="filter-group ">
                    <select
                        className="form-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {years && years.length > 0 && years.map((year, index) => {
                            return (
                                <option key={`year-${index}`} value={year.MaNamHoc}>
                                    {year.TenNamHoc}
                                </option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <StudentListTable selectedYear={selectedYear} />
            {/* truyền id năm học vào đây */}
        </div>
    );
};

export default StudentsListPage;
