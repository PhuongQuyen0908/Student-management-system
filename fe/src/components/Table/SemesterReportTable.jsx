import React from 'react';
import TableHeaderAction from '../TableHeaderAction';
import '../../styles/Table.scss';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import TableHeaderActionReport from '../TableHeaderActionReport';

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

const SemesterReportTable = ({
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
  lop: item.danhsachlop?.lop?.TenLop || item.lop || '[?]',
  tiLe: item.siSo ? Number(((item.soLuongDat / item.siSo) * 100).toFixed(2)) : 0
}));

const percentOfPassedTotal = data.map(item => ({
  lop: item.danhsachlop?.lop?.TenLop || item.lop || '[?]',
  tiLe: totalPassed ? Number(((item.soLuongDat / totalPassed) * 100).toFixed(2)) : 0
}));


  const shouldHighlight = (field) =>
    searchField === 'all' || searchField === field;

  return (
    <div className="semesterreport-table-wrapper">

      <TableHeaderActionReport
        searchTerm={searchTerm}
        searchField={searchField}
        onSearchChange={onSearchChange}
        onSearchFieldChange={onSearchFieldChange}
        onExportClick={onExportClick}
        searchOptions={[
          { value: 'all', label: 'Tất cả' },
          { value: 'lop', label: 'Lớp' },
          { value: 'siSo', label: 'Sĩ số' },
          { value: 'soLuongDat', label: 'Số lượng đạt' },
          { value: 'tiLe', label: 'Tỉ lệ' }
        ]}
      />

      <div className="table-container">
        <table className="table">
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
