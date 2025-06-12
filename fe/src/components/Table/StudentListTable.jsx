import TableHeaderAction from '../TableHeaderAction';
import '../../styles/Table.scss';

import { useState, useEffect, useContext } from "react";
import ReactPaginate from 'react-paginate';
import useStudentListTable from '../../hooks/useStudentListTable';
import { fetchStudentWithYear } from "../../services/studentServices";

//import 29/05/2025
import { FaSort } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// import context
import { UserContext } from '../../context/UserContext';

const StudentListTable = ({ selectedYear }) => {
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

    useEffect(() => {
        fetchStudents();
    }, [currentPage, selectedYear, searchTerm, sortField, sortOrder]);

    // highlightText function để làm nổi bật từ khóa tìm kiếm trong bảng
    // Hàm remove dấu tiếng Việt
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
                                <button className="sort-button" title="Sắp xếp" value="HoTen" //nút sort
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
                                        </tr>
                                    ))}
                                </>
                                :
                                <tr>
                                    <td colSpan="5">Không có học sinh nào</td>
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
        </div>
    );
};

export default StudentListTable;
