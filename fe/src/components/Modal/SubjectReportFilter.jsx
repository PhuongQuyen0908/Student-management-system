import { useEffect, useState } from 'react';
import axios from 'axios';
import reportService from '../../services/reportService';
import '../../styles/FilterGroup.scss';

const SubjectReportFilters = ({ onSubmit }) => {
    const [yearOptions, setYearOptions] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);

    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    useEffect(() => {
        reportService.getOptions()
            .then((res) => {
                const { namHoc, hocKy, monHoc } = res.data.DT;
                setYearOptions(namHoc);
                setSemesterOptions(hocKy);
                setSubjectOptions(monHoc);

                setSelectedYear(namHoc[0]?.value || '');
                setSelectedSemester(hocKy[0]?.value || '');
                setSelectedSubject(monHoc[0]?.value || '');
            })
            .catch((err) => console.error(err));
    }, []);

    const handleClick = () => {
        onSubmit({
            tenMonHoc: selectedSubject,
            tenHocKy: selectedSemester,
            tenNamHoc: selectedYear,
        });
    };

    return (
        <div className="filter-group">
            <label>
                Năm học:
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {yearOptions.map((item, idx) => (
                        <option key={idx} value={item.value}>{item.label}</option>
                    ))}
                </select>
            </label>

            <label>
                Học kỳ:
                <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                    {semesterOptions.map((item, idx) => (
                        <option key={idx} value={item.value}>{item.label}</option>
                    ))}
                </select>
            </label>

            <label>
                Môn học:
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    {subjectOptions.map((item, idx) => (
                        <option key={idx} value={item.value}>{item.label}</option>
                    ))}
                </select>
            </label>

            <button onClick={handleClick}>Lấy báo cáo</button>
        </div>
    );
};

export default SubjectReportFilters;
