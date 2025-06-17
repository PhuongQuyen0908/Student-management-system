import '../../styles/Table.scss';
import TableHeaderAction from '../TableHeaderAction';
import ModalAddStudent from '../Modal/ModalAddStudent';
import { FaEdit, FaLock, FaTrash } from 'react-icons/fa';
import useModal from '../../hooks/useModal';
import ModalUpdateStudent from '../Modal/ModalUpdateStudent';
//Các import mới
import ModalDeleteStudent from "../Modal/ModalDeleteStudent";
import ReactPaginate from 'react-paginate';
import { useEffect, useContext } from 'react';
import useStudentTable from '../../hooks/useStudentTable';
import { FaSort } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { fetchAllStudent } from "../../services/studentServices";
//import mới 27/05/2025
import { useState } from 'react';
import { use } from 'react';
//import mới 06/06/2025
import { UserContext } from '../../context/UserContext';
import { toast } from 'react-toastify';
//07/06/2025
const StudentTable = () => {
    //ẩn hiện các nút nếu k có quyền
    const { user } = useContext(UserContext);
    const userPermissions = user.account.groupWithPermissions.chucnangs

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
        dataModalStudent,
        searchTerm,
        handleSearchChange,
        handleSort, // hàm để xử lý sự kiện sắp xếp
        sortField, // trường đang sắp xếp
        sortOrder, // thứ tự sắp xếp
    } = useStudentTable();


    useEffect(() => {
        fetchStudents();
    }, [currentPage, searchTerm, sortField, sortOrder]) // mỗi làn click 1 trang sẽ load lại database users
    // mỗi lần click nút sort  sẽ load lại database users    

    // highlightText function để làm nổi bật từ khóa tìm kiếm trong bảng
    // Hàm remove dấu tiếng Việt
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date)) return "";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const highlightText = (text, keyword) => {
        if (!keyword || !text) return text;
        if (typeof text !== "string") text = String(text);

        const normalizedText = removeAccents(text).toLowerCase();
        const normalizedKeyword = removeAccents(keyword).toLowerCase();

        let result = [];
        let lastIndex = 0;

        // Tìm vị trí match trong normalizedText
        const regex = new RegExp(normalizedKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "gi");
        let match;

        while ((match = regex.exec(normalizedText)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            // Phần trước match (chuỗi gốc)
            if (lastIndex < start) {
                result.push(text.slice(lastIndex, start));
            }

            // Phần match (chuỗi gốc)
            //màu highlight
            result.push(
                <b key={start} style={{ color: "red" }}>
                    {text.slice(start, end)}
                </b>
            );

            lastIndex = end;
        }
        // Phần còn lại sau cùng
        if (lastIndex < text.length) {
            result.push(text.slice(lastIndex));
        }

        return result.length > 0 ? result : text;
    };

    const exportToExcel = async () => {
        try {
            const response = await fetchAllStudent(1, 10000, searchTerm, sortField, sortOrder);

            if (response && response.data && response.data.EC === 0) {
                const allStudents = response.data.DT.users;

                const data = allStudents.map(student => ({
                    'Mã học sinh': student.MaHocSinh,
                    'Họ và tên': student.HoTen,
                    'Ngày sinh': formatDate(student.NgaySinh),
                    'Giới tính': student.GioiTinh,
                    'Địa chỉ': student.DiaChi,
                    'Email': student.Email
                }));

                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách học sinh');

                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const file = new Blob([excelBuffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                saveAs(file, `TiepNhanHocSinh.xlsx`);
                toast.success("Xuất Excel thành công.");
            } else {
                toast.error("Xuất Excel thất bại: " + response?.data?.EM || "Lỗi không xác định");
            }
        } catch (error) {
            console.error("Error exporting students to Excel:", error);
            toast.error("Lỗi khi xuất file Excel");
        }
    };


    return (

        <div className="student-table-wrapper">
            <TableHeaderAction
                onAddClick={addModal.open}
                onSearchChange={(e) => handleSearchChange(e)}
                placeholder="Tìm kiếm học sinh..."
                addLabel="Thêm học sinh"
                //ẩn nút nếu k có quyền
                hideAdd={!(userPermissions.some(p => p.TenManHinhDuocLoad === "/student/create"))}
                onExportClick={exportToExcel}
            />

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mã học sinh
                                <button className="sort-button" title="Sắp xếp" value="MaHocSinh" //nút sort
                                    onClick={() => handleSort('MaHocSinh')}
                                >
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Họ và tên
                                <button className="sort-button" title="Sắp xếp" value="HoTen" //nút sort
                                    onClick={() => handleSort('HoTen')}
                                >
                                    <FaSort />
                                </button>
                            </th>
                            <th>Ngày sinh
                                <button className="sort-button" title="Sắp xếp" value="NgaySinh"
                                    onClick={() => handleSort('NgaySinh')}
                                >
                                    <FaSort />
                                </button>
                            </th>
                            <th>Giới tính
                                <button className="sort-button" title="Sắp xếp" value="GioiTinh"
                                    onClick={() => handleSort('GioiTinh')}
                                >
                                    <FaSort />
                                </button>
                            </th>
                            <th>
                                Địa chỉ
                            </th>
                            <th>Email
                                <button className="sort-button" title="Sắp xếp" value="Email"
                                    onClick={() => handleSort('Email')}
                                >
                                    <FaSort />
                                </button>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {userPermissions.some(p => p.TenManHinhDuocLoad === "/student/read") &&
                            listStudents && listStudents.length > 0 ?
                            <>
                                {listStudents.map((student, index) => (
                                    <tr key={`row ${index}`}>
                                        <td>{highlightText(student.MaHocSinh, searchTerm)}</td>
                                        <td>{highlightText(student.HoTen, searchTerm)}</td>
                                        <td>{highlightText(formatDate(student.NgaySinh), searchTerm)}</td>
                                        <td>{highlightText(student.GioiTinh, searchTerm)}</td>
                                        <td>{highlightText(student.DiaChi, searchTerm)}</td>
                                        <td>{highlightText(student.Email, searchTerm)}</td>
                                        <td>

                                            <div className="action-buttons">
                                                {userPermissions.some(p => p.TenManHinhDuocLoad === "/student/update") &&
                                                    <button className="icon-button edit" onClick={() => handleEditStudent(student)} title="Chỉnh sửa">
                                                        <FaEdit />
                                                    </button>
                                                }
                                                {userPermissions.some(p => p.TenManHinhDuocLoad === "/student/delete") &&
                                                    <button className="icon-button lock" onClick={() => handleDeleteStudent(student)} title="Khóa">
                                                        <FaTrash />
                                                    </button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                            : (
                                <tr>
                                    <td colSpan="5">Bạn không có quyền xem danh sách</td>
                                </tr>
                            )}
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
                        forcePage={currentPage - 1} // reset trang hiện tại khi sort 
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
