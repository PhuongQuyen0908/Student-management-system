import db from '../models/index.js';
// Hàm lấy tất cả các năm học
const getAllSchoolYears = async () => {
  try {
    const years = await db.namhoc.findAll();
    if (!years || years.length === 0) {
      throw new Error('Cơ sở dữ liệu trống');
    }
    return years;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách năm học: ' + error.message);
  }
};

// Hàm lấy năm học theo ID
const getSchoolYearById = async (id) => {
  try {
    const oneSchoolYear = await db.namhoc.findByPk(id);
    if (!oneSchoolYear) {
      throw new Error(`Không tìm thấy năm học với ID: ${id}`);
    }
    return oneSchoolYear;
  } catch (error) {
    throw new Error('Lỗi khi tìm năm học theo ID: ' + error.message);
  }
};

// Kiểm tra năm học đã tồn tại chưa (dựa trên tên năm học)
const checkSchoolYearExists = async (SchoolYearName) => {
  try {
    const existingSchoolYear = await db.namhoc.findOne({
      where: { NamHoc: SchoolYearName }
    });
    return existingSchoolYear !== null; // Trả về true nếu năm học đã tồn tại, ngược lại trả về false
  } catch (error) {
    throw new Error('Lỗi khi kiểm tra năm học: ' + error.message);
  }
};

// Hàm tạo năm học học mới
const createSchoolYear = async (data) => {
  try {
    const newSchoolYear = await db.namhoc.create(data);
    return newSchoolYear;
  } catch (error) {
    throw new Error('Lỗi khi tạo năm học mới: ' + error.message);
  }
};

// Hàm cập nhật năm học học
const updateSchoolYear = async (id, data) => {
  try {
    const SchoolYearToUpdate = await db.namhoc.findByPk(id);
    if (!SchoolYearToUpdate) {
      throw new Error('Năm học không tồn tại');
    }
    await SchoolYearToUpdate.update(data);
    return SchoolYearToUpdate;
  } catch (error) {
    throw new Error('Lỗi khi cập nhật năm học: ' + error.message);
  }
};

// Hàm xóa năm học học
const deleteSchoolYear = async (id) => {
  try {
    const deleted = await db.namhoc.destroy({ where: { MaNam: id } });
    if (!deleted) {
      throw new Error('Năm học không tồn tại');
    }
    return deleted;
  } catch (error) {
    throw new Error('Lỗi khi xóa năm học: ' + error.message);
  }
};

module.exports = { 
  getAllSchoolYears,
  getSchoolYearById,
  checkSchoolYearExists,
  createSchoolYear,
  updateSchoolYear,
  deleteSchoolYear 
};
