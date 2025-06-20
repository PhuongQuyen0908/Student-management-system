import { useEffect, useState } from "react";
import reportService from "../../services/reportService";
import "../../styles/FilterGroup.scss";
import "../../styles/Button.scss";

const SemesterReportFilter = ({ onSubmit }) => {
  const [yearOptions, setYearOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  useEffect(() => {
    reportService
      .getOptions()
      .then((res) => {
        const { namHoc, hocKy } = res.data.DT;

        setYearOptions(namHoc);
        setSemesterOptions(hocKy);

        const defaultYear = namHoc[0]?.value || "";
        const defaultSemester = hocKy[0]?.value || "";

        setSelectedYear(defaultYear);
        setSelectedSemester(defaultSemester);


       

      })
      .catch((err) => {
        console.error(err);
        setYearOptions([]);
        setSemesterOptions([]);
      });
  }, []);


  const handleClick = () => {
    onSubmit({
      tenHocKy: selectedSemester,
      tenNamHoc: selectedYear,
    });
  };

  return (
    <div className="filter-group">
      <label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          disabled={yearOptions.length === 0}
        >
          {yearOptions.map((item, idx) => (
            <option key={idx} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          disabled={semesterOptions.length === 0}
        >
          {semesterOptions.map((item, idx) => (
            <option key={idx} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <button className="report-button" onClick={handleClick}>
        Lấy báo cáo
      </button>
    </div>
  );
};

export default SemesterReportFilter;
