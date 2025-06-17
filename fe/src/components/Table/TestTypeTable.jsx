/* eslint-disable no-unused-vars */
import "../../styles/Table.scss";
import { FaEdit, FaTrash } from "react-icons/fa";
import ModalAddTestType from "../Modal/ModalAddTestType";
import ModalUpdateTestType from "../Modal/ModalUpdateTestType";
import ModalDeleteTestType from "../Modal/ModalDeleteTestType";
import TableHeaderAction from "../TableHeaderAction";
import useTestTypeTable from "../../hooks/useTestTypeTable";
import { useEffect } from "react";

const TestTypeTable = () => {
    const {
        testList,
        updateModal,
        deleteModal,
        selectedTest,
        handleAddTest,
        handleOpenUpdateModal,
        handleOpenDeleteModal,
        handleUpdateTest,
        handleDeleteTest,
        fetchTestTypes,
    } = useTestTypeTable();

    useEffect(() => {
        fetchTestTypes();
    }, []);

    return (
        <div className="class-table-wrapper">
            <TableHeaderAction
                placeholder="Tìm kiếm loại kiểm tra..."
                hideAdd
            />

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mã loại kiểm tra</th>
                            <th>Tên loại kiểm tra</th>
                            <th>Hệ số</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {testList.length > 0 ? (
                            testList.map((test) => (
                                <tr key={test.MaLoaiKiemTra}>
                                    <td>{test.MaLoaiKiemTra}</td>
                                    <td>{test.TenLoaiKiemTra}</td>
                                    <td>{test.HeSo}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="icon-button edit" onClick={() => handleOpenUpdateModal(test)}>
                                                <FaEdit />
                                            </button>
                                            <button className="icon-button delete" onClick={() => handleOpenDeleteModal(test)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4">Không có dữ liệu</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* {addModal.isOpen && (
                <ModalAddTestType
                    show={addModal.isOpen}
                    handleClose={addModal.close}
                    onSubmit={handleAddTest}
                />
            )} */}
            {updateModal.isOpen && (
                <ModalUpdateTestType
                    show={updateModal.isOpen}
                    handleClose={updateModal.close}
                    testData={selectedTest}
                    onSubmit={handleUpdateTest}
                />
            )}
            {deleteModal.isOpen && (
                <ModalDeleteTestType
                    show={deleteModal.isOpen}
                    handleClose={deleteModal.close}
                    testData={selectedTest}
                    onSubmit={handleDeleteTest}
                />
            )}
        </div>
    );
};

export default TestTypeTable;
