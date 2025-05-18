import '../../styles/Table.scss';
import { FaEdit, FaTrash } from 'react-icons/fa';
import useModal from '../../hooks/useModal';
import ModalAddSubject from '../Modal/ModalAddSubject';
import ModalUpdateSubject from '../Modal/ModalUpdateSubject';
import ModalDeleteSubject from '../Modal/ModalDeleteSubject';
import TableHeaderAction from '../TableHeaderAction';
import ReactPaginate from 'react-paginate';
import { useEffect } from 'react';
import useSubjectTable from '../../hooks/useSubjectTable';

const SubjectTable = () => {
    const {
        addModal,
        updateModal,
        deleteModal,
        listSubjects,
        fetchSubjects,
        handleDeleteSubject,
        confirmDeleteSubject,
        handleEditSubject,
        dataModalSubject,
        dataModal,
    } = useSubjectTable();

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
                            {/* <th>Số điểm đạt</th> */}
                            <th>Hệ số</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listSubjects && listSubjects.length > 0 ? (
                            listSubjects.map((subject, index) => (
                                <tr key={`subject-${index}`}>
                                    <td>{subject.MaMonHoc}</td>
                                    <td>{subject.TenMonHoc}</td>
                                    {/* <td>{subject.DiemDat}</td> */}
                                    <td>{subject.HeSo}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="icon-button edit"
                                                onClick={() => handleEditSubject(subject)}
                                                title="Chỉnh sửa"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="icon-button delete"
                                                onClick={() => handleDeleteSubject(subject)}
                                                title="Xoá"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Không tìm thấy môn học nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {addModal.isOpen && (
                <ModalAddSubject
                    show={addModal.isOpen}
                    handleClose={addModal.close}
                    fetchSubjects={fetchSubjects}
                />
            )}

            {updateModal.isOpen && (
                <ModalUpdateSubject
                    show={updateModal.isOpen}
                    handleClose={updateModal.close}
                    fetchSubjects={fetchSubjects}
                    dataModalSubject={dataModalSubject}
                />
            )}

            {deleteModal.isOpen && (
                <ModalDeleteSubject
                    show={deleteModal.isOpen}
                    handleClose={deleteModal.close}
                    confirmDeleteSubject={confirmDeleteSubject}
                    dataModal={dataModal}
                />
            )}
        </div>
    );
};

export default SubjectTable;