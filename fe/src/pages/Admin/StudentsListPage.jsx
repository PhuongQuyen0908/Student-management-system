import React from 'react';
import '../../styles/Page/StudentsListPage.scss'
import StudentListTable from '../../components/Table/StudentListTable';
// sẽ sửa sau 
import { useState, useEffect } from 'react';
import { featchAllYear } from '../../services/studentServices';

const StudentsListPage = () => {
    const [years, setYears] = useState([]); // 2014-2015 , ....
    const [selectedYear, setSelectedYear] = useState(''); // mã năm học để lọc 

    useEffect(() => {
        fetchYears();
    }, [])
    const fetchYears = async () => {
        try {
            let response = await featchAllYear();
            console.log('response', response);
            if (response && response.data) {
                setYears(response.data.data);
                setSelectedYear(response.data.data[0].MaNamHoc); // set year đầu tiên là mặc định
            }
        } catch (error) {
            console.error('Error fetching years:', error);
        }
    };


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
            <StudentListTable selectedYear ={selectedYear}/> 
            {/* truyền id năm học vào đây */}
        </div>
    );
};

export default StudentsListPage;
