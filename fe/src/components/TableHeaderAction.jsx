import React from 'react';
import '../styles/TableHeaderAction.scss'

const TableHeaderAction = ({ onSearchChange, onAddClick, addLabel, placeholder, hideAdd = false, hideExport = false,
    onExportClick }) => {
    return (
        <div className="table-header-action">
            <div className="left-group">
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    onChange={onSearchChange}
                />

                {!hideExport && (
                    <button className="export-button" onClick={onExportClick}>
                        Xuất Excel
                    </button>
                )}
            </div>
            {!hideAdd && (
                <button className="add-button" onClick={onAddClick}>
                    {addLabel}
                </button>
            )}
        </div>
    );
};

export default TableHeaderAction;