import React, { useState, useMemo } from 'react';
import '../../styles/Page/SemesterReportPage.scss';
import SemesterReportTable from '../../components/Table/SemesterReportTable';
import SemesterReportFilter from '../../components/Modal/SemesterReportFilter';
import reportService from '../../services/reportService';

// Merge Sort + Merge
const mergeSort = (array, key, order) => {
  if (array.length <= 1) return array;
  const mid = Math.floor(array.length / 2);
  const left = mergeSort(array.slice(0, mid), key, order);
  const right = mergeSort(array.slice(mid), key, order);
  return merge(left, right, key, order);
};

const merge = (left, right, key, order) => {
  const result = [];
  while (left.length && right.length) {
    const comparison =
      typeof left[0][key] === 'string'
        ? left[0][key].localeCompare(right[0][key])
        : left[0][key] - right[0][key];
    if ((order === 'asc' && comparison <= 0) || (order === 'desc' && comparison > 0)) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  return [...result, ...left, ...right];
};

const SemesterReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [reportMeta, setReportMeta] = useState({
    hocKy: '',
    namHoc: '',
    diemDat: null,
  });
  const [sortConfig, setSortConfig] = useState({ sortBy: null, order: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      sortBy: key,
      order: prev.sortBy === key && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.sortBy) return reportData;
    return mergeSort([...reportData], sortConfig.sortBy, sortConfig.order);
  }, [reportData, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter((row) =>
      row.lop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.siSo.toString().includes(searchTerm) ||
      row.soLuongDat.toString().includes(searchTerm) ||
      row.tiLe.toString().includes(searchTerm)
    );
  }, [sortedData, searchTerm]);

  const handleFilterSubmit = async (filters) => {
    try {
      const res = await reportService.getSemesterReport(filters);

      if (
        res.status === 200 &&
        res.data.EC === 0 &&
        res.data.DT.EC === 0
      ) {
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

  return (
    <div className="semesterreport-page-container">
      <div className="semesterreport-table-wrapper">
        <SemesterReportFilter onSubmit={handleFilterSubmit} />
        <SemesterReportTable
          data={filteredData}
          meta={reportMeta}
          onSort={handleSort}
          sortConfig={sortConfig}
          onSearchChange={setSearchTerm}
        />
      </div>
    </div>
  );
};

export default SemesterReportPage;
