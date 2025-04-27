import db from '../models/index.js';

// Hàm lấy tất cả các khối
const getAllGrades = async () => {
  try {
    const grades = await db.khoi.findAll();
    if (!grades || grades.length === 0) {
      throw new Error('Cơ sở dữ liệu trống');
    }
    return grades;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách khối: ' + error.message);
  }
};

// Hàm lấy khối học theo ID
const getGradeById = async (id) => {
  try {
    const oneGrade = await db.khoi.findByPk(id);
    if (!oneGrade) {
      throw new Error(`Không tìm thấy khối với ID: ${id}`);
    }
    return oneGrade;
  } catch (error) {
    throw new Error('Lỗi khi tìm khối theo ID: ' + error.message);
  }
};

// Kiểm tra khối đã tồn tại chưa (dựa trên tên khối)
const checkGradeExists = async (GradeName) => {
  try {
    const existingGrade = await db.khoi.findOne({
      where: { TenKhoi: GradeName }
    });
    return existingGrade !== null; // Trả về true nếu khối đã tồn tại, ngược lại trả về false
  } catch (error) {
    throw new Error('Lỗi khi kiểm tra khối: ' + error.message);
  }
};

// Hàm tạo khối học mới
const createGrade = async (data) => {
  try {
    const newGrade = await db.khoi.create(data);
    return newGrade;
  } catch (error) {
    throw new Error('Lỗi khi tạo khối mới: ' + error.message);
  }
};



// Hàm cập nhật khối học
const updateGrade = async (id, data) => {
  try {
    const GradeToUpdate = await db.khoi.findByPk(id);
    if (!GradeToUpdate) {
      throw new Error('khối không tồn tại');
    }
    await GradeToUpdate.update(data);
    return GradeToUpdate;
  } catch (error) {
    throw new Error('Lỗi khi cập nhật khối: ' + error.message);
  }
};

// Hàm xóa khối học
const deleteGrade = async (id) => {
  try {
    const deleted = await db.khoi.destroy({ where: { MaKhoi: id } });
    if (!deleted) {
      throw new Error('khối không tồn tại');
    }
    return deleted;
  } catch (error) {
    throw new Error('Lỗi khi xóa khối: ' + error.message);
  }
};

module.exports = { 
  getAllGrades,
  getGradeById,
  checkGradeExists,
  createGrade,
  updateGrade,
  deleteGrade 
};
