import React, { useState } from 'react';
import '../styles/StudentTable.scss';
import TableHeaderAction from './TableHeaderAction';
import ModalAddStudent from './Modal/ModalAddStudent';
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
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);

    const handleOpenAddModal = () => {
        setIsShowModalAdd(true);
    };

    const handleCloseAddModal = () => {
        setIsShowModalAdd(false);
    };
    return (

        <div className="student-table-wrapper">
            <TableHeaderAction
                onAddClick={handleOpenAddModal}
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isShowModalAdd && (
                <ModalAddStudent
                    show={isShowModalAdd}
                    handleClose={handleCloseAddModal}
                />
            )}
        </div>

    );
};

export default StudentTable;
