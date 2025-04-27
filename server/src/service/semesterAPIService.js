import db from '../models/index.js';

// Hàm lấy tất cả các học kỳ
const getAllSemesters = async () => {
  try {
    const semesters = await db.hocky.findAll();
    if (!semesters || semesters.length === 0) {
      throw new Error('Cơ sở dữ liệu trống');
    }
    return semesters;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách học kỳ: ' + error.message);
  }
};

// Hàm lấy học kỳ theo ID
const getSemesterById = async (id) => {
  try {
    const semester = await db.hocky.findByPk(id);
    if (!semester) {
      throw new Error(`Không tìm thấy học kỳ với ID: ${id}`);
    }
    return semester;
  } catch (error) {
    throw new Error('Lỗi khi tìm học kỳ theo ID: ' + error.message);
  }
};

// Kiểm tra học kỳ đã tồn tại chưa (dựa trên tên học kỳ)
const checkSemesterxists = async (SemesterName) => {
  try {
    const existingSemester = await db.hocky.findOne({
      where: { TenHocKy: SemesterName }
    });
    return existingSemester !== null; // Trả về true nếu học kỳ đã tồn tại, ngược lại trả về false
  } catch (error) {
    throw new Error('Lỗi khi kiểm tra học kỳ: ' + error.message);
  }
};

// Hàm tạo học kỳ học mới
const createSemester = async (data) => {
  try {
    const newSemester = await db.hocky.create(data);
    return newSemester;
  } catch (error) {
    throw new Error('Lỗi khi tạo học kỳ mới: ' + error.message);
  }
};

// Hàm cập nhật học kỳ học
const updateSemester = async (id, data) => {
  try {
    const SemesterToUpdate = await db.hocky.findByPk(id);
    if (!SemesterToUpdate) {
      throw new Error('học kỳ không tồn tại');
    }
    await SemesterToUpdate.update(data);
    return SemesterToUpdate;
  } catch (error) {
    throw new Error('Lỗi khi cập nhật học kỳ: ' + error.message);
  }
};

// Hàm xóa học kỳ học
const deleteSemester = async (id) => {
  try {
    const deleted = await db.hocky.destroy({ where: { MaLop: id } });
    if (!deleted) {
      throw new Error('học kỳ không tồn tại');
    }
    return deleted;
  } catch (error) {
    throw new Error('Lỗi khi xóa học kỳ: ' + error.message);
  }
};

module.exports = { 
  getAllSemesters,
  getSemesterById,
  checkSemesterxists,
  createSemester,
  updateSemester,
  deleteSemester 
};
