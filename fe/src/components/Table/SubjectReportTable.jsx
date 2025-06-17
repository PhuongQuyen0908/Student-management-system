import React from 'react';
import '../../styles/Table/SubjectReportTable.scss';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a569bd', '#5dade2', '#f1948a', '#45b39d'];

const highlightText = (text, term) => {
  if (!term || typeof text !== 'string') return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === term.toLowerCase()
      ? <span key={i} style={{ backgroundColor: 'yellow' }}>{part}</span>
      : part
  );
};

const SubjectReportTable = ({
  data,
  meta,
  onSort,
  sortConfig,
  searchTerm,
  searchField,
  onSearchChange,
  onSearchFieldChange,
  onExportClick
}) => {
  const renderSortableHeader = (label, key) => (
    <th onClick={() => onSort(key)} style={{ cursor: 'pointer' }}>
      {label}{' '}
      {sortConfig?.sortBy === key &&
        (sortConfig.order === 'asc' ? '▲' : '▼')}
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
  console.log(searchField)

  return (
    <div className="subjectreport-table-wrapper">
      <div className="subjectreport-search-actions" style={{ display: 'flex', gap: '0.5cm', marginBottom: '10px' }}>
        <input
          type="text"
          className="input-search"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select
          className="select-search-field"
          value={searchField}
          onChange={(e) => onSearchFieldChange(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="lop">Lớp</option>
          <option value="siSo">Sĩ số</option>
          <option value="soLuongDat">Số lượng đạt</option>
          <option value="tiLe">Tỉ lệ</option>
        </select>
        <button className="btn-export" onClick={onExportClick}>Xuất Excel</button>
      </div>

      <table className="subjectreport-table">
        <thead>
          <tr>
            <th>STT</th>
            {renderSortableHeader('Lớp', 'lop')}
            {renderSortableHeader('Sĩ số', 'siSo')}
            {renderSortableHeader('Số lượng đạt', 'soLuongDat')}
            {renderSortableHeader('Tỉ lệ', 'tiLe')}
          </tr>
        </thead>
        <tbody>
  {data.length > 0 ? (
    data.map((item, index) => (
      <tr key={index}>
        <td>{item.stt || index + 1}</td>
        <td>
  {searchField === 'all' || searchField === 'lop'
    ? highlightText(item.lop, searchTerm)
    : item.lop}
</td>
<td>
  {searchField === 'all' || searchField === 'siSo'
    ? highlightText(String(item.siSo), searchTerm)
    : item.siSo}
</td>
<td>
  {searchField === 'all' || searchField === 'soLuongDat'
    ? highlightText(String(item.soLuongDat), searchTerm)
    : item.soLuongDat}
</td>
<td>
  {searchField === 'all' || searchField === 'tiLe'
    ? highlightText(item.tiLe, searchTerm)
    : item.tiLe}
</td>

      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} style={{ textAlign: 'center' }}>Không có dữ liệu</td>
    </tr>
  )}
</tbody>
      </table>

      {/* Biểu đồ cột */}
      <div className="subjectreport-chart-container">
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

      {/* Biểu đồ tròn: tỉ lệ trong lớp */}
      <div className="subjectreport-piechart-container">
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

export default SubjectReportTable;