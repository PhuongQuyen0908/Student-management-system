import db from '../models/index.js';

const buildResponse = (EM, EC, DT) => ({ EM, EC, DT });
const getAllGrades = async () => {
  try {
    const grades = await db.khoi.findAll();
    return buildResponse("Lấy danh sách khối thành công", 0, grades);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khối:", error);
    return buildResponse("Lỗi phía server. Lấy danh sách khối thất bại", -1, []);
  } 
}

const getGradeByName = async (gradeName) => {
  try {
    const grade = await db.khoi.findAll({ where: { TenKhoi: gradeName } });
    if (!grade) {
      return buildResponse("Khối không tồn tại", 1, []);
    }
    return buildResponse("Lấy thông tin khối thành công", 0, grade);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khối:", error);
    return buildResponse("Lỗi phía server. Lấy thông tin khối thất bại", -1, []);
  }
}


const checkGradeExists = async (gradeName) => {
  try {
    const grade = await db.khoi.findOne({ where: { TenKhoi: gradeName } });
    return !!grade;
  } catch (error) {
    console.error("Lỗi khi kiểm tra khối tồn tại:", error);
    return false;
  }
}   

const createGrade = async (data) => {
  try {
    const newGrade = await db.khoi.create({
      TenKhoi: data.GradeName,
    });
    return buildResponse("Tạo khối học thành công", 0, newGrade);
  } catch (error) {
    console.error("Lỗi khi tạo khối:", error);
    return buildResponse("Lỗi phía server. Tạo khối thất bại", -1, []);
  }
}     
const updateGrade = async (id, data) => {
  try {
    const gradeToUpdate = await db.khoi.findByPk(id);
    if (!gradeToUpdate) {
      return buildResponse("Khối không tồn tại", 1, []);
    }
    await gradeToUpdate.update({
      TenKhoi: data.GradeName,
    });
    return buildResponse("Cập nhật khối học thành công", 0, gradeToUpdate);
  } catch (error) {
    console.error("Lỗi khi cập nhật khối:", error);
    return buildResponse("Lỗi phía server. Cập nhật khối thất bại", -1, []);
  }
} 
const deleteGrade = async (id) => {
  try {
    const deleted = await db.khoi.destroy({ where: { MaKhoi: id } });
    if (!deleted) {
      return buildResponse("Khối không tồn tại để xóa", 1, []);
    }
    return buildResponse("Xóa khối thành công", 0, { id });
  } catch (error) {
    console.error("Lỗi khi xóa khối:", error);
    return buildResponse("Lỗi phía server. Xóa khối thất bại", -1, []);
  }
} 
const checkClassExists = async (className) => {
  try {
    const existed = await db.lop.findOne({ where: { TenLop: className } });
    return !!existed;
  } catch (error) {
    console.error("Lỗi khi kiểm tra lớp tồn tại:", error);
    return false;
  }
} 
module.exports = {
  getAllGrades,
  getGradeByName,
  checkGradeExists,
  createGrade,
  updateGrade,
  deleteGrade,
  checkClassExists,
};