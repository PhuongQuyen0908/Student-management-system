import React, { useState, useMemo } from 'react';
import '../../styles/Page/SemesterReportPage.scss';
import SemesterReportTable from '../../components/Table/SemesterReportTable';
import SemesterReportFilter from '../../components/Modal/SemesterReportFilter';
import reportService from '../../services/reportService';
import { useEffect } from 'react';

const SemesterReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [reportMeta, setReportMeta] = useState({
    hocKy: '',
    namHoc: '',
    diemDat: null,
  });
  const [sortConfig, setSortConfig] = useState({ sortBy: null, order: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterSubmit = async (filters) => {
  try {
    const res = await reportService.getSemesterReport({
      ...filters,
      searchTerm: searchTerm.trim(),  // ✅ Gửi kèm searchTerm
    });

    if (res.status === 200 && res.data.EC === 0 && res.data.DT.EC === 0) {
      const { ketQua, hocKy, namHoc, diemDat } = res.data.DT.DT;
      setReportMeta({ hocKy, namHoc, diemDat });
      setReportData(ketQua || []);
    } else {
      alert('Không thể lấy báo cáo học kỳ.');
    }
  } catch (error) {
    console.error(error);
    alert('Lỗi kết nối đến server.');
  }
};

useEffect(() => {
  if (reportMeta.hocKy && reportMeta.namHoc) {
    handleFilterSubmit({
      tenHocKy: reportMeta.hocKy,
      tenNamHoc: reportMeta.namHoc,
    });
  }
}, [searchTerm]);


  const handleSort = (key) => {
    const order =
      sortConfig.sortBy === key && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ sortBy: key, order });

    setReportData((prevData) =>
      [...prevData].sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (typeof valA === 'string') {
          return order === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else {
          return order === 'asc' ? valA - valB : valB - valA;
        }
      })
    );
  };

  console.log('Search:', searchTerm);
  console.log('Data:', reportData);

  return (
    <div className="semesterreport-page-container">
      <div className="semesterreport-table-wrapper">
        <SemesterReportFilter onSubmit={handleFilterSubmit} />

        <SemesterReportTable
          data={reportData}
          meta={reportMeta}
          sortConfig={sortConfig}
          onSort={handleSort}
          onSearchChange={setSearchTerm}
        />
      </div>
    </div>
  );
};

export default SemesterReportPage;
