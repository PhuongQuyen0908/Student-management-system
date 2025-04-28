import db from '../models/index.js';

// Hàm lấy tất cả các môn học học
const getAllSubjects = async () => {
  try {
    const subjects = await db.monhoc.findAll();
    if (!subjects || subjects.length === 0) {
      throw new Error('Cơ sở dữ liệu trống');
    }
    return subjects;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách môn học: ' + error.message);
  }
};

// Hàm lấy môn học học theo ID
const getSubjectById = async (id) => {
  try {
    const subject = await db.monhoc.findByPk(id);
    if (!subject) {
      throw new Error(`Không tìm thấy môn học với ID: ${id}`);
    }
    return subject;
  } catch (error) {
    throw new Error('Lỗi khi tìm môn học theo ID: ' + error.message);
  }
};

// Kiểm tra môn học đã tồn tại chưa (dựa trên tên môn học)
const checkSubjectExists = async (subjectName) => {
  try {
    const existingSubject = await db.monhoc.findOne({
      where: { TenMonHoc: subjectName }
    });
    return existingSubject !== null; // Trả về true nếu môn học đã tồn tại, ngược lại trả về false
  } catch (error) {
    throw new Error('Lỗi khi kiểm tra môn học: ' + error.message);
  }
};

// Hàm tạo môn học học mới
const createSubject = async (data) => {
  try {
    const newSubject = await db.monhoc.create(data);
    return newSubject;
  } catch (error) {
    throw new Error('Lỗi khi tạo môn học mới: ' + error.message);
  }
};

// Hàm cập nhật môn học học
const updateSubject = async (id, data) => {
  try {
    const SubjectToUpdate = await db.monhoc.findByPk(id);
    if (!SubjectToUpdate) {
      throw new Error('môn học không tồn tại');
    }
    await SubjectToUpdate.update(data);
    return SubjectToUpdate;
  } catch (error) {
    throw new Error('Lỗi khi cập nhật môn học: ' + error.message);
  }
};

// Hàm xóa môn học học
const deleteSubject = async (id) => {
  try {
    const deleted = await db.monhoc.destroy({ where: { MaMonHoc: id } });
    if (!deleted) {
      throw new Error('môn học không tồn tại');
    }
    return deleted;
  } catch (error) {
    throw new Error('Lỗi khi xóa môn học: ' + error.message);
  }
};

module.exports = { 
  getAllSubjects,
  getSubjectById,
  checkSubjectExists,
  createSubject,
  updateSubject,
  deleteSubject 
};
