import '../../styles/Table.scss';
import TableHeaderAction from '../TableHeaderAction';
import ModalAddStudent from '../Modal/ModalAddStudent';
import { FaEdit, FaLock } from 'react-icons/fa';
import useModal from '../../hooks/useModal';
import ModalUpdateStudent from '../Modal/ModalUpdateStudent';
//Các import mới
import ModalDeleteStudent from "../Modal/ModalDeleteStudent";
import ReactPaginate from 'react-paginate';
import { useEffect } from 'react';
import useStudentTable from '../../hooks/useStudentTable';
import { FaSort } from 'react-icons/fa';

const StudentTable = () => {
    // const addModal = useModal();
    // const updateModal = useModal();
    // const deleteModal = useModal();
    const {
        addModal,
        updateModal,
        deleteModal,
        listStudents,//danh sách học sinh load từ database
        currentPage, //trang hiện tại
        totalPages, //tổng trang
        fetchStudents, //load lại danh sách học sinh
        handlePageClick, //click vào trang nào thì load lại danh sách học sinh
        handleDeleteStudent, //mở modal delete
        confirmDeleteStudent, //xác nhận xóa học sinh
        handleEditStudent,
        dataModal,
        dataModalStudent } = useStudentTable();

    useEffect(() => {
        fetchStudents();
    }, [currentPage]) // mỗi làn click 1 trang sẽ load lại database users


    return (

        <div className="student-table-wrapper">
            <TableHeaderAction
                onAddClick={addModal.open}
                onSearchChange={(value) => console.log('Tìm kiếm:', value)}
                placeholder="Tìm kiếm học sinh..."
                addLabel="Thêm học sinh"
            />

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mã học sinh</th>
                            <th>
                                Họ và tên
                                <button className="sort-button" title="Sắp xếp">
                                    <FaSort />
                                </button>
                            </th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>Địa chỉ</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listStudents && listStudents.length > 0 ?
                                <>
                                    {listStudents.map((student, index) => (
                                        <tr key={`row ${index}`}>
                                            <td>{student.MaHocSinh}</td>
                                            <td>{student.HoTen}</td>
                                            <td>{student.NgaySinh}</td>
                                            <td>{student.GioiTinh}</td>
                                            <td>{student.DiaChi}</td>
                                            <td>{student.Email}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="icon-button edit" onClick={() => handleEditStudent(student)} title="Chỉnh sửa">
                                                        <FaEdit />
                                                    </button>
                                                    <button className="icon-button lock" onClick={() => handleDeleteStudent(student)} title="Khóa">
                                                        <FaLock />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                                :
                                <>
                                    <tr><td>Not found users</td></tr>
                                </>}
                    </tbody>
                </table>
            </div>
            {/* pagination */}
            {totalPages > 0 &&
                <div className="student-footer">
                    <ReactPaginate
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={totalPages}
                        previousLabel="Previous"
                        pageClassName="page-item"
                        pageLinkClassName="number page-link"
                        previousClassName="page-item"
                        previousLinkClassName="prev page-link"
                        nextClassName="page-item"
                        nextLinkClassName="next page-link"
                        nextLabel="Next"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="break page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                    />
                </div>
            }

            {addModal.isOpen && (
                <ModalAddStudent
                    show={addModal.isOpen}
                    handleClose={addModal.close}
                    fetchStudents={fetchStudents}

                />
            )}
            {updateModal.isOpen && (
                <ModalUpdateStudent
                    show={updateModal.isOpen}
                    handleClose={updateModal.close}
                    fetchStudents={fetchStudents}
                    dataModalStudent={dataModalStudent}
                />
            )}
            {deleteModal.isOpen && <ModalDeleteStudent
                show={deleteModal.isOpen}
                handleClose={deleteModal.close}
                confirmDeleteStudent={confirmDeleteStudent}
                dataModal={dataModal} // truyền dữ liệu vào modal
            />}
        </div>

    );
};

export default StudentTable;
