import { FaEdit, FaTrash } from 'react-icons/fa';
import useModal from '../../hooks/useModal';
import TableHeaderAction from '../TableHeaderAction';
import ModalStudentList from '../Modal/ModalStudentList';

const dummyStudentData = [
    {
        name: 'Nguyễn Văn A',
        gender: 'Nam',
        birthYear: '2007',
        address: 'Hà Nội',
        email: 'vana@gmail.com',
    },
    {
        name: 'Trần Thị B',
        gender: 'Nữ',
        birthYear: '2006',
        address: 'Hải Phòng',
        email: 'thib@gmail.com',
    },
    {
        name: 'Lê Văn C',
        gender: 'Nam',
        birthYear: '2005',
        address: 'Đà Nẵng',
        email: 'vanc@gmail.com',
    },
];

const ClassListTable = () => {
    const showlistModal = useModal();
    return (
        <div className="classlist-table-wrapper">
            <TableHeaderAction
                onAddClick={showlistModal.open}
                onSearchChange={(value) => console.log('Tìm kiếm:', value)}
                placeholder="Tìm kiếm học sinh..."
                addLabel="Thêm học sinh"
            />

            <div className="classlist-table-container">
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ và tên</th>
                            <th>Giới tính</th>
                            <th>Năm sinh</th>
                            <th>Địa chỉ</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyStudentData.map((student, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{student.name}</td>
                                <td>{student.gender}</td>
                                <td>{student.birthYear}</td>
                                <td>{student.address}</td>
                                <td>{student.email}</td>
                                <td>
                                    <div className="action-buttons">

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

            {showlistModal.isOpen && (
                <ModalStudentList
                    show={showlistModal.isOpen}
                    handleClose={showlistModal.close}
                />
            )}
        </div>
    );
};

export default ClassListTable;
