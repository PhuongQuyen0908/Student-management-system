import '../../styles/Table.scss';
import { FaEdit, FaTrash } from 'react-icons/fa';
import useModal from '../../hooks/useModal';
import ModalAddSubject from '../Modal/ModalAddSubject';
import ModalUpdateSubject from '../Modal/ModalUpdateSubject';
import TableHeaderAction from '../TableHeaderAction';

const dummySubjectData = [
    { code: 'M001', name: 'Toán', passingScore: '5', coefficient: '2' },
    { code: 'M002', name: 'Lý', passingScore: '5', coefficient: '1' },
    { code: 'M003', name: 'Hóa', passingScore: '5', coefficient: '1' },
];

const SubjectTable = () => {
    const addModal = useModal();
    const updateModal = useModal();

    return (
        <div className="subject-table-wrapper">
            <TableHeaderAction
                onAddClick={addModal.open}
                onSearchChange={(value) => console.log('Tìm kiếm:', value)}
                placeholder="Tìm kiếm môn học..."
                addLabel="Thêm môn học"
            />

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mã môn học</th>
                            <th>Tên môn học</th>
                            <th>Số điểm đạt</th>
                            <th>Hệ số</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummySubjectData.map((subjectItem, index) => (
                            <tr key={index}>
                                <td>{subjectItem.code}</td>
                                <td>{subjectItem.name}</td>
                                <td>{subjectItem.passingScore}</td>
                                <td>{subjectItem.coefficient}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="icon-button edit" onClick={updateModal.open} title="Chỉnh sửa">
                                            <FaEdit />
                                        </button>
                                        <button className="icon-button delete" title="Xoá">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {addModal.isOpen && (
                <ModalAddSubject
                    show={addModal.isOpen}
                    handleClose={addModal.close}
                />
            )}
            {updateModal.isOpen && (
                <ModalUpdateSubject
                    show={updateModal.isOpen}
                    handleClose={updateModal.close}
                />
            )}
        </div>
    );
};

export default SubjectTable;
