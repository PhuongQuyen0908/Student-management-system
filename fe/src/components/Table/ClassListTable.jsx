import React from 'react';
import { FaTrash } from 'react-icons/fa';
import TableHeaderAction from '../TableHeaderAction';
import ModalStudentList from '../Modal/ModalStudentList';
import useClassListTable from '../../hooks/useClassListTable';
import '../../styles/Table.scss';

const ClassListTable = ({ selectedYear, selectedClass, setStudentCount }) => {
    const {
        students,
        loading,
        searchTerm,
        studentListModal,
        handleSearchChange,
        handleRemoveStudent,
        handleAddStudents,
    } = useClassListTable(selectedYear, selectedClass, setStudentCount);

    return (
        <div className="classlist-table-wrapper">
            <TableHeaderAction
                onAddClick={studentListModal.open}
                onSearchChange={(e) => handleSearchChange(e.target.value)}
                searchTerm={searchTerm}
                placeholder="Tìm kiếm học sinh..."
                addLabel="Thêm học sinh"
            />

            <div className="table-container">
                {loading ? (
                    <div className="text-center my-3">Đang tải...</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Họ và tên</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Địa chỉ</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((student, index) => (
                                    <tr key={student.id || index}>
                                        <td>{index + 1}</td>
                                        <td>{student.name}</td>
                                        <td>{student.gender}</td>
                                        <td>{student.birthYear}</td>
                                        <td>{student.address}</td>
                                        <td>{student.email}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="icon-button delete"
                                                    title="Xoá"
                                                    onClick={() => handleRemoveStudent(student.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">Bạn không có quyền xem danh sách</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {studentListModal.isOpen && (
                <ModalStudentList
                    show={studentListModal.isOpen}
                    handleClose={studentListModal.close}
                    selectedYear={selectedYear}
                    selectedClass={selectedClass}
                    onSave={handleAddStudents}
                />
            )}
        </div>
    );
};

export default ClassListTable;