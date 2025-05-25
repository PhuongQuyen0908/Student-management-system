/* eslint-disable no-unused-vars */
import { FaEdit, FaPlus } from 'react-icons/fa';
import ModalUpdateGrade from '../Modal/ModalUpdateGrade';
import ModalAddGrade from '../Modal/ModalAddGrade';
import TableHeaderAction from '../TableHeaderAction';
import useSubjectGradeTable from '../../hooks/useSubjectGradeTable';
import '../../styles/Table/Table.scss';

const SubjectGradeTable = ({ filters }) => {
  const {
    grades,
    loading,
    error,
    editModalOpen,
    addModalOpen,
    currentEditGrade,
    openEditModal,
    closeEditModal,
    openAddModal,
    closeAddModal,
    addGrade,
    updateGrade,
    selectedStudent
  } = useSubjectGradeTable(filters);
  

  return (
    <div className="subjectgrade-table-wrapper">
      <TableHeaderAction
        onSearchChange={(value) => {}}
        placeholder="Tìm kiếm học sinh..."
        hideAdd={true}
      />
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="subjectgrade-table-container">
          <table className="subjectgrade-table">
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Kiểm tra 15 phút</th>
                <th>Kiểm tra 1 tiết</th>
                <th>Kiểm tra học kỳ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 && (
                <tr><td colSpan="5">Không có dữ liệu điểm</td></tr>
              )}
              {grades.map((student, idx) => (
                <tr key={idx}>
                  <td>{student.name}</td>
                  <td>{student.test15}</td>
                  <td>{student.test1period}</td>
                  <td>{student.final}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-button edit"
                        title="Chỉnh sửa điểm"
                        onClick={() => openEditModal(student)}>
                        <FaEdit />
                      </button>
                      <button
                        className="icon-button add"
                        title="Thêm điểm mới"
                        onClick={() => openAddModal(student)}>
                        <FaPlus />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editModalOpen && currentEditGrade && (
        <ModalUpdateGrade
          show={editModalOpen}
          handleClose={closeEditModal}
          grade={currentEditGrade}
          onSave={updateGrade}
        />
      )}
      {addModalOpen && (
        <ModalAddGrade
          show={addModalOpen}
          handleClose={closeAddModal}
          onAdd={addGrade}
          student={selectedStudent}
          context={filters}
        />
      )}
    </div>
  );
};

export default SubjectGradeTable;