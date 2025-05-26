/* eslint-disable no-unused-vars */
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import ModalUpdateGrade from '../Modal/ModalUpdateGrade';
import ModalAddGrade from '../Modal/ModalAddGrade';
import ModalDeleteScore from '../Modal/ModalDeleteScore';
import TableHeaderAction from '../TableHeaderAction';
import useSubjectGradeTable from '../../hooks/useSubjectGradeTable';
import '../../styles/Table.scss';

const SubjectGradeTable = ({ filters }) => {
  const {
    grades,
    loading,
    error,
    currentTarget,
    editModalOpen,
    addModalOpen,
    openEditModal,
    deleteModalOpen,
    closeEditModal,
    openAddModal,
    closeAddModal,
    openDeleteModal,
    closeDeleteModal,
    addGrade,
    updateGrade,
    removeGrade,
    testTypes
  } = useSubjectGradeTable(filters);

  return (
    <div className="subjectgrade-table-wrapper">
      <TableHeaderAction
        onSearchChange={() => { }}
        placeholder="Tìm kiếm học sinh..."
        hideAdd={true}
      />
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Họ và tên</th>
                {testTypes.map(type => (
                  <th key={type.MaLoaiKiemTra}>{type.TenLoaiKiemTra}</th>
                ))}
                <th>Điểm trung bình môn</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 && (
                <tr><td colSpan={testTypes.length + 3}>Không có dữ liệu điểm</td></tr>
              )}
              {grades.map((student, idx) => (
                <tr key={idx}>
                  <td>{student.name}</td>
                  {testTypes.map(type => (
                    <td key={type.MaLoaiKiemTra}>
                      {student.diemTP?.find(d => d.LoaiKiemTra === type.TenLoaiKiemTra)?.Diem ?? ""}
                    </td>
                  ))}
                  <td>{student.diemTB}</td>
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
                      <button
                        className="icon-button delete"
                        title="Xóa điểm"
                        onClick={() => openDeleteModal(student)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editModalOpen && currentTarget && (
        <ModalUpdateGrade
          show={editModalOpen}
          handleClose={closeEditModal}
          grade={currentTarget}
          onSave={updateGrade}
          testTypes={testTypes}
        />
      )}
      {addModalOpen && (
        <ModalAddGrade
          show={addModalOpen}
          handleClose={closeAddModal}
          onAdd={addGrade}
          student={currentTarget}
          context={filters}
          testTypes={testTypes}
        />
      )}
      {deleteModalOpen && currentTarget && (
        <ModalDeleteScore
          show={deleteModalOpen}
          handleClose={closeDeleteModal}
          student={currentTarget}
          testTypes={testTypes}
          context={filters}
          onDelete={removeGrade}
        />
      )}
    </div>
  );
};

export default SubjectGradeTable;