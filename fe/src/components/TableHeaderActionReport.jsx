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
                borderRadius: '6px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
                color: '#333',
                fontSize: '14px',
                cursor: 'pointer',
                minWidth: '150px',
                padding: '10px 30px 10px 12px',  // tăng padding phải
    height: '42px',
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
