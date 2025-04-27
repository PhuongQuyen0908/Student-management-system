import '../../styles/Table/StudentTable.scss';
import TableHeaderAction from '../TableHeaderAction';
import ModalAddStudent from '../Modal/ModalAddStudent';
import { FaEdit, FaLock } from 'react-icons/fa';
import useModal from '../../hooks/useModal';
import ModalUpdateStudent from '../Modal/ModalUpdateStudent';
const dummyData = [
    {
        id: 'K23521327',
        name: 'Nguyễn Phương Quyên',
        birth: '29-02-2024',
        gender: 'Nữ',
        address: 'Đông Hòa, Dĩ An, Bình Dương',
        email: 'nguyenphuongquyen0908@gmail.com',
    },

    {
        id: 'K23521327',
        name: 'Nguyễn Phương Quyên',
        birth: '29-02-2024',
        gender: 'Nữ',
        address: 'Đông Hòa, Dĩ An, Bình Dương',
        email: 'nguyenphuongquyen0908@gmail.com',
    },
    {
        id: 'K23521327',
        name: 'Nguyễn Phương Quyên',
        birth: '29-02-2024',
        gender: 'Nữ',
        address: 'Đông Hòa, Dĩ An, Bình Dương',
        email: 'nguyenphuongquyen0908@gmail.com',
    },
    {
        id: 'K23521327',
        name: 'Nguyễn Phương Quyên',
        birth: '29-02-2024',
        gender: 'Nữ',
        address: 'Đông Hòa, Dĩ An, Bình Dương',
        email: 'nguyenphuongquyen0908@gmail.com',
    },
];

const StudentTable = () => {
    const addModal = useModal();
    const updateModal = useModal();
    return (

        <div className="student-table-wrapper">
            <TableHeaderAction
                onAddClick={addModal.open}
                onSearchChange={(value) => console.log('Tìm kiếm:', value)}
                placeholder="Tìm kiếm học sinh..."
                addLabel="Thêm học sinh"
            />

            <div className="student-table-container">
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>Mã học sinh</th>
                            <th>Họ và tên</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>Địa chỉ</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyData.map((student, index) => (
                            <tr key={index}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.birth}</td>
                                <td>{student.gender}</td>
                                <td>{student.address}</td>
                                <td>{student.email}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="icon-button edit" onClick={updateModal.open} title="Chỉnh sửa">
                                            <FaEdit />
                                        </button>
                                        <button className="icon-button lock" title="Khóa">
                                            <FaLock />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {addModal.isOpen && (
                <ModalAddStudent
                    show={addModal.isOpen}
                    handleClose={addModal.close}
                />
            )}
            {updateModal.isOpen && (
                <ModalUpdateStudent
                    show={updateModal.isOpen}
                    handleClose={updateModal.close}
                />
            )}
        </div>

    );
};

export default StudentTable;
