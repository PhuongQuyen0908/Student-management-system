import React from 'react';
import '../styles/TableHeaderAction.scss';

const TableHeaderActionReport = ({
  searchTerm,
  searchField,
  onSearchChange,
  onSearchFieldChange,
  onExportClick,
  placeholder = "Tìm kiếm...",
  searchOptions = [],
}) => {
  return (
    <div className="table-header-action">
      <div className="left-group">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <select

          value={searchField}
          onChange={(e) => onSearchFieldChange(e.target.value)}
          style={{
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='%236b7280' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
            backgroundSize: '14px',
            padding: '8px 14px',
            paddingRight: '28px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            backgroundColor: '#fff',
            color: '#374151',
            fontSize: '15px',
            height: '40px',
            lineHeight: '1.5',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {searchOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button className="export-button" onClick={onExportClick}>
          Xuất Excel
        </button>
      </div>
    </div>
  );
};

export default TableHeaderActionReport;
