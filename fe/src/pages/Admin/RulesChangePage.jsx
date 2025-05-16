import React from 'react';
import '../../styles/Page/RulesChangePage.scss';
import TableHeaderAction from '../../components/TableHeaderAction';

const RulesChangePage = () => {
    return (
        <div className="ruleschange-page-container">
            <div className="ruleschange-header">
                <h2 className="ruleschange-title">Thay đổi quy định</h2>
            </div>

            <div className="ruleschange-search-wrapper">
                <TableHeaderAction
                    onSearchChange={(value) => console.log('Tìm kiếm:', value)}
                    placeholder="Tìm kiếm..."
                    hideAdd={true}
                />
            </div>

            <div className="ruleschange-card full">
                <div className="ruleschange-two-column">
                    <div className="half">
                        <h3>Thêm năm học</h3>
                        <label>Năm học</label>
                        <div className="input-group">
                            <input type="text" placeholder="VD: 2025 - 2026" />
                            <button>Thêm</button>
                        </div>
                    </div>
                    <div className="half align-right">
                        <h3>Danh sách năm học đã học</h3>
                        <select className="schoolyear-dropdown">
                            <option>2024 - 2025</option>
                            <option>2023 - 2024</option>
                            <option>2022 - 2023</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="ruleschange-card full">
                <h3>Cài đặt số tuổi</h3>
                <div className="ruleschange-two-column">
                    <div className="half">
                        <label>Số tuổi tối thiểu</label>
                        <div className="input-group">
                            <input type="number" />
                            <button>Lưu</button>
                        </div>
                    </div>
                    <div className="half">
                        <label>Số tuổi tối đa</label>
                        <div className="input-group">
                            <input type="number" />
                            <button>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ruleschange-card full">
                <h3>Cài đặt số điểm</h3>
                <div className="ruleschange-two-column">
                    <div className="half">
                        <label>Số điểm tối thiểu</label>
                        <div className="input-group">
                            <input type="number" />
                            <button>Lưu</button>
                        </div>
                    </div>
                    <div className="half">
                        <label>Số điểm tối đa</label>
                        <div className="input-group">
                            <input type="number" />
                            <button>Lưu</button>
                        </div>
                    </div>
                </div>
                <div className="single-input">
                    <label>Điểm đạt</label>
                    <div className="input-group">
                        <input type="number" />
                        <button>Lưu</button>
                    </div>
                </div>
            </div>

            <div className="ruleschange-card full">
                <h3>Cài đặt sĩ số</h3>
                <div className="single-input">
                    <label>Sĩ số</label>
                    <div className="input-group">
                        <input type="number" />
                        <button>Lưu</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RulesChangePage;
