import TableHeaderAction from '../TableHeaderAction';
import '../../styles/Table.scss';

const SubjectReportTable = ({ data, meta, onSort, sortConfig }) => {

    const renderSortableHeader = (label, key) => (
        <th onClick={() => onSort(key)} style={{ cursor: 'pointer' }}>
            {label}{' '}
            {sortConfig?.sortBy === key &&
                (sortConfig.order === 'asc' ? '▲' : '▼')}
        </th>
    );

    return (
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
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.stt}</td>
                                <td>{item.lop}</td>
                                <td>{item.siSo}</td>
                                <td>{item.soLuongDat}</td>
                                <td>{item.tiLe}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center' }}>Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SubjectReportTable;



