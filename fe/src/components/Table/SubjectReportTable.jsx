import TableHeaderAction from '../TableHeaderAction';
import '../../styles/Table.scss';

const dummySubjectReport = [
    {
        class: '10A1',
        totalStudents: 40,
        passedStudents: 36,
        passRate: '90%',
    },
    {
        class: '10A2',
        totalStudents: 42,
        passedStudents: 38,
        passRate: '90.5%',
    },
];

const SubjectReportTable = () => {
    return (
        <div className="subjectreport-table-wrapper">
            <TableHeaderAction
                onSearchChange={(value) => console.log('Tìm kiếm:', value)}
                placeholder="Tìm kiếm lớp..."
                hideAdd={true}
            />
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Lớp</th>
                            <th>Sĩ số</th>
                            <th>Số lượng đạt</th>
                            <th>Tỉ lệ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummySubjectReport.map((report, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{report.class}</td>
                                <td>{report.totalStudents}</td>
                                <td>{report.passedStudents}</td>
                                <td>{report.passRate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubjectReportTable;
