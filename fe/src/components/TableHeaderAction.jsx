import React from 'react';
import '../styles/TableHeaderAction.scss'

const TableHeaderAction = ({ onSearchChange, onAddClick, addLabel, placeholder }) => {
    return (
        <div className="table-header-action">
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                onChange={onSearchChange}
            />
            <button className="add-button" onClick={onAddClick}>
                {addLabel}
            </button>
        </div>
    );
};

export default TableHeaderAction;