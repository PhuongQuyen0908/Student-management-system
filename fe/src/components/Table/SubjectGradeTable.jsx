import { FaEdit, FaPlus } from 'react-icons/fa';
import useModal from '../../hooks/useModal';
import ModalEditGrade from '../Modal/ModalUpdateGrade';
import ModalAddGrade from '../Modal/ModalAddGrade';
import TableHeaderAction from '../TableHeaderAction';
import '../../styles/Table/SubjectGradeTable.scss';

const dummyGradesData = [
    {
        name: 'Nguyễn Văn A',
        test15: 8,
        test1period: 7,
        final: 9,
    },
    {
        name: 'Trần Thị B',
        test15: 9,
        test1period: 8,
        final: 7,
    },
];

const SubjectGradeTable = () => {
    const editModal = useModal();
    const addColumnModal = useModal();
    return (
        <div className="subjectgrade-table-wrapper">
            <TableHeaderAction
                onSearchChange={(value) => console.log('Tìm kiếm:', value)}
                placeholder="Tìm kiếm học sinh..."
                hideAdd={true}
            />
            <div className="subjectgrade-table-container">
                <table className="subjectgrade-table">
                    <thead>
                        <tr>
                            <th>Họ và tên</th>
                            <th>Kiểm tra 15 phút</th>
                            <th>Kiểm tra 1 tiết</th>
                            <th>Kiểm tra học kỳ</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyGradesData.map((student, index) => (
                            <tr key={index}>
                                <td>{student.name}</td>
                                <td>{student.test15}</td>
                                <td>{student.test1period}</td>
                                <td>{student.final}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="icon-button edit"
                                            title="Chỉnh sửa điểm"
                                            onClick={editModal.open}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="icon-button add"
                                            title="Thêm cột điểm"
                                            onClick={addColumnModal.open}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editModal.isOpen && (
                <ModalEditGrade show={editModal.isOpen} handleClose={editModal.close} />
            )}
            {addColumnModal.isOpen && (
                <ModalAddGrade show={addColumnModal.isOpen} handleClose={addColumnModal.close} />
            )}
        </div>
    );
};

export default SubjectGradeTable;
