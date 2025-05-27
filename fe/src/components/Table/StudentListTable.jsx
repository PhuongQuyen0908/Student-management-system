import TableHeaderAction from '../TableHeaderAction';
import '../../styles/Table.scss';

//các import mới
import { useState, useEffect } from "react";
import ReactPaginate from 'react-paginate';
import useStudentListTable from '../../hooks/useStudentListTable';



const StudentListTable = ({ selectedYear }) => {

    const {
        listStudents,
        handlePageClick,
        totalPages,
        fetchStudents,
        currentPage,
        searchTerm, // nhập giá trị search
        handleSearchChange // search
    } = useStudentListTable(selectedYear);

    useEffect(() => {
        fetchStudents();
    }, [currentPage, selectedYear , searchTerm]);

    

    return (
        <div className="studentlist-table-wrapper">
            <TableHeaderAction
                onSearchChange={(e)=> handleSearchChange(e)}
                placeholder="Tìm kiếm học sinh..."
                hideAdd={true}
            />
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mã học sinh</th>
                            <th>Họ và tên</th>
                            <th>Lớp</th>
                            <th>Điểm TB học kỳ I</th>
                            <th>Điểm TB học kỳ II</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listStudents && listStudents.length > 0 ?
                                <>
                                    {listStudents.map((student, index) => (
                                        <tr key={`student-${index}`}>
                                            <td>{student.MaHocSinh}</td>
                                            <td>{student.HoTen}</td>
                                            <td>{student.TenLop}</td>
                                            <td>{student.DiemTB_HK1}</td>
                                            <td>{student.DiemTB_HK2}</td>
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
                    />
                </div>
            }
        </div>
    );
};

export default StudentListTable;
