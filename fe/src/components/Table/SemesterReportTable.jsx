import React from 'react';
import TableHeaderAction from '../TableHeaderAction';
import '../../styles/Table.scss';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a569bd', '#5dade2', '#f1948a', '#45b39d'];

const SemesterReportTable = ({ data, meta, onSort, sortConfig, onSearchChange }) => {
  const renderSortableHeader = (label, key) => (
    <th onClick={() => onSort && onSort(key)} style={{ cursor: 'pointer' }}>
      {label}{' '}
      {sortConfig?.sortBy === key && (sortConfig.order === 'asc' ? '▲' : '▼')}
    </th>
  );

  const totalPassed = data.reduce((acc, curr) => acc + curr.soLuongDat, 0);

  const percentPassedByClass = data.map(item => ({
    lop: item.lop,
    tiLe: item.siSo ? Number(((item.soLuongDat / item.siSo) * 100).toFixed(2)) : 0
  }));

  const percentOfPassedTotal = data.map(item => ({
    lop: item.lop,
    tiLe: totalPassed ? Number(((item.soLuongDat / totalPassed) * 100).toFixed(2)) : 0
  }));

  return (
    <div className="semesterreport-table-wrapper">

      <TableHeaderAction
        onSearchChange={(e) => onSearchChange(e.target.value)}
        placeholder="Tìm kiếm lớp, sĩ số, số lượng đạt, tỷ lệ đạt..."
        hideAdd={true}
      />

      <div className="table-container">
        <table className="table">
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
            {data.length > 0 ? (
              data.map((report, index) => (
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

      <div className="semesterreport-piechart-container">
        <h4>Biểu đồ tròn: Tỉ lệ đạt trên sĩ số theo lớp (%)</h4>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie data={percentPassedByClass} dataKey="tiLe" nameKey="lop" cx="50%" cy="50%" outerRadius={120} label>
              {percentPassedByClass.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <h4>Biểu đồ tròn: Tỉ lệ số lượng đạt so với tổng đạt (%)</h4>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie data={percentOfPassedTotal} dataKey="tiLe" nameKey="lop" cx="50%" cy="50%" outerRadius={120} label>
              {percentOfPassedTotal.map((entry, index) => (
                <Cell key={`cell-total-${index}`} fill={COLORS[index % COLORS.length]} />
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
