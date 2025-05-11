import TableHeaderAction from '../TableHeaderAction';
import '../../styles/Table/StudentListTable.scss';

const dummyStudentList = [
    {
        name: 'Nguyễn Văn A',
        class: '10A1',
        avgTerm1: 7.8,
        avgTerm2: 8.2,
    },
    {
        name: 'Trần Thị B',
        class: '10A2',
        avgTerm1: 8.5,
        avgTerm2: 8.9,
    },
];

const StudentListTable = () => {
    return (
        <div className="studentlist-table-wrapper">
            <TableHeaderAction
                onSearchChange={(value) => console.log('Tìm kiếm:', value)}
                placeholder="Tìm kiếm học sinh..."
                hideAdd={true}
            />
            <div className="studentlist-table-container">
                <table className="studentlist-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ và tên</th>
                            <th>Lớp</th>
                            <th>Điểm TB học kỳ I</th>
                            <th>Điểm TB học kỳ II</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyStudentList.map((student, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{student.name}</td>
                                <td>{student.class}</td>
                                <td>{student.avgTerm1}</td>
                                <td>{student.avgTerm2}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentListTable;
