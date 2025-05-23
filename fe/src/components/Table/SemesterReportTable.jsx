// src/components/Table/SemesterReportTable.jsx
import React, { useState } from 'react';
import TableHeaderAction from '../TableHeaderAction';
import '../../styles/Table/SemesterReportTable.scss';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a569bd', '#5dade2', '#f1948a', '#45b39d'];

const SemesterReportTable = ({ data, meta, onSort, sortConfig }) => {

  const renderSortableHeader = (label, key) => (
    <th onClick={() => onSort(key)} style={{ cursor: 'pointer' }}>
      {label}{' '}
      {sortConfig?.sortBy === key &&
        (sortConfig.order === 'asc' ? '▲' : '▼')}
    </th>
  );
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((row) =>
    row.lop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="semesterreport-table-wrapper">
      <h3 className="semesterreport-title">
        Báo cáo học kỳ: {meta.hocKy} - Năm học: {meta.namHoc} (Điểm đạt: {meta.diemDat})
      </h3>

      <TableHeaderAction
        onSearchChange={setSearchTerm}
        placeholder="Tìm kiếm lớp..."
        hideAdd={true}
      />

      <div className="semesterreport-table-container">
        <table className="semesterreport-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Lớp</th>
              {renderSortableHeader('Sĩ số', 'siSo')}
              {renderSortableHeader('Số lượng đạt', 'soLuongDat')}
              {renderSortableHeader('Tỉ lệ', 'tiLe')}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((report, index) => (
                <tr key={index}>
                  <td>{report.stt || index + 1}</td>
                  <td>{report.lop}</td>
                  <td>{report.siSo}</td>
                  <td>{report.soLuongDat}</td>
                  <td>{report.tiLe}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    {/* Biểu đồ cột */}
      <div className="semesterreport-chart-container">
        <h4>Biểu đồ cột: Số lượng đạt theo lớp</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="lop" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="soLuongDat" name="Số lượng đạt" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ tròn */}
      <div className="semesterreport-piechart-container">
        <h4>Biểu đồ tròn: Tỉ lệ số lượng đạt giữa các lớp</h4>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              dataKey="soLuongDat"
              nameKey="lop"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#82ca9d"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SemesterReportTable;
