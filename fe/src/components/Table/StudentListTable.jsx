//import 29/05/2025
import { FaSort, FaPuzzlePiece } from 'react-icons/fa';
import TableHeaderAction from '../TableHeaderAction';
import '../../styles/Table.scss';

import { useState, useEffect, useContext } from "react";
import ReactPaginate from 'react-paginate';
import useStudentListTable from '../../hooks/useStudentListTable';
import { fetchStudentWithYear } from "../../services/studentServices";
import ModalStudentGrade from '../Modal/ModalStudentGrade'; // modal hiển thị điểm

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

// import context
import { UserContext } from '../../context/UserContext';

const StudentListTable = ({ selectedYear, yearName }) => {
    const { isAvailable } = useContext(UserContext); // lấy phân quyền

    const {
        listStudents,
        handlePageClick,
        totalPages,
        fetchStudents,
        currentPage,
        searchTerm, // nhập giá trị search
        handleSearchChange, // search
        handleSort, // chức năng sort
        sortField, // trường đang sắp xếp
        sortOrder // thứ tự sắp xếp
    } = useStudentListTable(selectedYear);

    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, [currentPage, selectedYear, searchTerm, sortField, sortOrder]);

    // Hàm remove dấu tiếng Việt
    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // highlightText function để làm nổi bật từ khóa tìm kiếm trong bảng
    const highlightText = (text, keyword) => {
        if (!keyword || !text) return text;
        if (typeof text !== "string") text = String(text);

        const normalizedText = removeAccents(text).toLowerCase();
        const normalizedKeyword = removeAccents(keyword).toLowerCase();

        let result = [];
        let lastIndex = 0;

        const regex = new RegExp(normalizedKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "gi");
        let match;

        while ((match = regex.exec(normalizedText)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            if (lastIndex < start) {
                result.push(text.slice(lastIndex, start));
            }

            //màu highlight
            result.push(
                <b key={start} style={{ color: "red" }}>
                    {text.slice(start, end)}
                </b>
            );

            lastIndex = end;
        }

        if (lastIndex < text.length) {
            result.push(text.slice(lastIndex));
        }

        return result.length > 0 ? result : text;
    };

    const exportToExcel = async () => {
        try {
            const response = await fetchStudentWithYear(
                selectedYear,
                1,
                10000,
                searchTerm,
                sortField,
                sortOrder
            );

            if (response && response.data && response.data.EC === 0) {
                const allStudents = response.data.DT.students;

                const data = allStudents.map(student => ({
                    'Mã học sinh': student.MaHocSinh,
                    'Họ và tên': student.HoTen,
                    'Lớp': student.TenLop,
                    'Điểm TB học kỳ I': student.DiemTB_HK1,
                    'Điểm TB học kỳ II': student.DiemTB_HK2
                }));

                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách học sinh');

                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const file = new Blob([excelBuffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                saveAs(file, `DanhSachHocSinh_${selectedYear}.xlsx`);
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
        <div className="studentlist-table-wrapper">
            <TableHeaderAction
                onSearchChange={(e) => handleSearchChange(e)}
                placeholder="Tìm kiếm học sinh..."
                hideAdd={true}
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
                            <th>Họ và tên
                                <button className="sort-button" title="Sắp xếp" value="HoTen"
                                    onClick={() => handleSort('HoTen')}
                                >
                                    <FaSort />
                                </button>
                            </th>
                            <th>Lớp
                                <button className="sort-button" title="Sắp xếp" value="TenLop"
                                    onClick={() => handleSort('TenLop')}
                                >
                                    <FaSort />
                                </button>
                            </th>
                            <th>Điểm TB học kỳ I
                                <button className="sort-button" title="Sắp xếp" value="DiemTB_HK1"
                                    onClick={() => handleSort('DiemTB_HK1')}
                                >
                                    <FaSort />
                                </button>
                            </th>
                            <th>Điểm TB học kỳ II
                                <button className="sort-button" title="Sắp xếp" value="DiemTB_HK2"
                                    onClick={() => handleSort('DiemTB_HK2')}
                                >
                                    <FaSort />
                                </button>
                            </th>
                            <th>Chi Tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listStudents && listStudents.length > 0 ?
                                <>
                                    {listStudents.map((student, index) => (
                                        <tr key={`student-${index}`}>
                                            <td>{highlightText(student.MaHocSinh, searchTerm)}</td>
                                            <td>{highlightText(student.HoTen, searchTerm)}</td>
                                            <td>{highlightText(student.TenLop, searchTerm)}</td>
                                            <td>{highlightText(student.DiemTB_HK1, searchTerm)}</td>
                                            <td>{highlightText(student.DiemTB_HK2, searchTerm)}</td>
                                            <td>
                                                <button className="icon-button lock"
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setShowModal(true);
                                                    }}>
                                                    <FaPuzzlePiece />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                                :
                                <tr>
                                    <td colSpan="6">Không có học sinh nào</td>
                                </tr>
                        }
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
                        forcePage={currentPage - 1} // vì currentPage bắt đầu từ 1, trong khi ReactPaginate bắt đầu từ 0
                    />
                </div>
            }

            {/* Modal chi tiết bảng điểm */}
            {showModal && selectedStudent && yearName && 
            <ModalStudentGrade
                show={showModal}
                onHide={() => {setShowModal(false); setSelectedStudent(null);}}
                student={selectedStudent}
                yearName={yearName}
            />
}
        </div>
    );
};

export default StudentListTable;
