import { useEffect, useState } from 'react';
import reportService from '../../services/reportService';

const SubjectReportFilters = ({ onSubmit }) => {
  const [yearOptions, setYearOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    reportService.getOptionsReport()
      .then((res) => {
        const { namHoc = [], hocKy = [], monHoc = [] } = res.data?.DT || {};

        if (namHoc.length > 0 && hocKy.length > 0 && monHoc.length > 0) {
          setYearOptions(namHoc);
          setSemesterOptions(hocKy);
          setSubjectOptions(monHoc);

          const defaultFilter = {
            tenNamHoc: namHoc[0].value,
            tenHocKy: hocKy[0].value,
            tenMonHoc: monHoc[0].value
          };

          setSelectedYear(defaultFilter.tenNamHoc);
          setSelectedSemester(defaultFilter.tenHocKy);
          setSelectedSubject(defaultFilter.tenMonHoc);

          console.log("Gửi filter mặc định ban đầu:", defaultFilter);
        } else {
          console.warn("Không có dữ liệu năm học, học kỳ hoặc môn học.");
        }
      })
      .catch((err) => console.error("Lỗi khi gọi getOptions:", err));
  }, []);

  const handleClick = () => {
    const filter = {
      tenMonHoc: selectedSubject,
      tenHocKy: selectedSemester,
      tenNamHoc: selectedYear,
    };

    console.log("📤 Đang gửi filter người dùng chọn:", filter);
    onSubmit(filter);
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

      <button className="report-button" onClick={handleClick}>
        Lấy báo cáo
      </button>
    </div>
  );
};

export default SubjectReportFilters;
