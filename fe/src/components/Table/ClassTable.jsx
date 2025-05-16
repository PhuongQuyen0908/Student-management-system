import '../../styles/Table.scss';
import { FaEdit, FaTrash } from 'react-icons/fa';
import useModal from '../../hooks/useModal';
import ModalAddClass from '../Modal/ModalAddClass';
import ModalUpdateClass from '../Modal/ModalUpdateClass';
import TableHeaderAction from '../TableHeaderAction';

const dummyClassData = [
    { name: 'Lớp 10A1', grade: '10' },
    { name: 'Lớp 11B2', grade: '11' },
    { name: 'Lớp 12C3', grade: '12' },
];

const ClassTable = () => {
    const addModal = useModal();
    const updateModal = useModal();

    return (
        <div className="class-table-wrapper">
            <TableHeaderAction
                onAddClick={addModal.open}
                onSearchChange={(value) => console.log('Tìm kiếm:', value)}
                placeholder="Tìm kiếm lớp học..."
                addLabel="Thêm lớp học"
            />

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên lớp học</th>
                            <th>Khối lớp</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyClassData.map((classItem, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{classItem.name}</td>
                                <td>{classItem.grade}</td>
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
                <ModalAddClass
                    show={addModal.isOpen}
                    handleClose={addModal.close}
                />
            )}
            {updateModal.isOpen && (
                <ModalUpdateClass
                    show={updateModal.isOpen}
                    handleClose={updateModal.close}
                />
            )}
        </div>
    );
};

export default ClassTable;
