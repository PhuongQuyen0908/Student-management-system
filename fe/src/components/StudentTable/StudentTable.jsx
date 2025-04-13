import React from 'react';
import { useState, useEffect } from 'react';
import { fetchAllStudent ,deleteStudent } from '../../services/studentServices';
import { useNavigate } from 'react-router-dom'
import './StudentTable.scss'
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify'
//Modal
import ModalDeleteStudent from "../Modal/ModalDeleteStudent";
import ModalStudent from '../Modal/ModalStudent.jsx';
//icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faCirclePlus, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const Users = props => {
    const [listStudents, setListStudents] = useState([]);

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    //Delete Modal
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModal] = useState({});

    //modal update/create user
    const [isShowModalStudent, setIsShowModalStudent] = useState(false);
    const [actionModalStudent, setActionModalStudent] = useState(""); // Create or Edit
    const [dataModalStudent, setDataModalStudent] = useState({}); // truyền dữ liệu vào modal


    useEffect(() => {
        fetchStudents();
    }, [currentPage]) // mỗi làn click 1 trang sẽ load lại database users

    const fetchStudents = async () => {
        let response = await fetchAllStudent(currentPage, currentLimit);
        if (response && response.data && response.data.EC === 0) {
            setTotalPages(response.data.DT.totalPages);
            setListStudents(response.data.DT.users);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDeleteStudent = async (user) => {
        setIsShowModalDelete(true);
        console.log("check is show" , isShowModalDelete);
        setDataModal(user);
    }

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModal({});
    }

    const confirmDeleteStudent = async () => {
        let response = await deleteStudent(dataModal);
        if (response && response.data.EC === 0) {
            toast.success(response.data.EM);
            await fetchStudents();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.data.EM)
        }
    }

    const onHideModalStudent = async () => {
        setIsShowModalStudent(false);
        setDataModalStudent({});
        await fetchStudents(); // load lại danh sách user sau khi thêm mới hoặc sửa

    }

    const handleEditStudent = (student) => {
        setIsShowModalStudent(true);
        setActionModalStudent("UPDATE");
        setDataModalStudent(student); // truyền dữ liệu vào modal
    }

    const handleRefresh = async () => {
        await fetchStudents();
    }

    return (
        <>
            <div className="container">
                <div className="manage-students-container">
                    <div className="student-header">
                        <div className='actions my-3'>
                            <button
                                className="btn btn-success refresh"
                                // onClick={() => handleRefresh()}
                            >
                                <FontAwesomeIcon icon={faArrowsRotate} />Refresh
                            </button>
                            <button className="btn btn-primary" onClick={() => {
                                setIsShowModalStudent(true)
                                 setActionModalStudent("CREATE")
                            }}>
                                <FontAwesomeIcon icon={faCirclePlus} />
                                Add new user
                            </button>
                        </div>
                    </div>
                    <div className="student-body">
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">STT</th>
                                    <th scope="col">Mã học sinh</th>
                                    <th scope="col">Họ Tên</th>
                                    <th scope="col">Ngày sinh</th>
                                    <th scope="col">Giới tính</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Email</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {listStudents && listStudents.length > 0 ?
                                    <>
                                        {listStudents.map((item, index) => {
                                            return (
                                                <tr key={`row-${index}`}>
                                                    <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                                                    <td>{item.maHS}</td>
                                                    <td>{item.HoTen}</td>
                                                    <td>{item.NgaySinh}</td>
                                                    <td>{item.GioiTinh}</td>
                                                    <td>{item.DiaChi}</td>
                                                    <td>{item.Email}</td>
                                                    <td>
                                                        <span title="Edit"
                                                            className="edit"
                                                            onClick={() => handleEditStudent(item)}
                                                            >
                                                            <FontAwesomeIcon icon={faPencil} />
                                                        </span>
                                                        <span title="Delete"
                                                            className="delete"
                                                            onClick={() => handleDeleteStudent(item)}   
                                                            >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </>
                                    :
                                    <>
                                        <tr><td>Not found users</td></tr>
                                    </>
                                }
                            </tbody>
                        </table>
                    </div>
                    {/* pagination */}
                    {totalPages > 0 &&
                        <div className="student-footer">
                            <ReactPaginate
                                nextLabel="next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={totalPages}
                                previousLabel="< previous"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                            />
                        </div>
                    }
                </div>
            </div>
            {<ModalDeleteStudent
                show={isShowModalDelete}
                handleClose={handleClose}
                confirmDeleteStudent={confirmDeleteStudent}
                dataModal={dataModal} // truyền dữ liệu vào modal
            />}

            <ModalStudent
                onHide={onHideModalStudent}
                isShowModalStudent={isShowModalStudent}
                action={actionModalStudent}
                dataModalStudent={dataModalStudent} // truyền dữ liệu vào modal
            />
        </>

    );
};

export default Users;