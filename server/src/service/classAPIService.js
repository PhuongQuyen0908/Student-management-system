import db from '../models/index.js';

// Hàm lấy tất cả các lớp học
const getAllClasses = async () => {
  try {
    const classes = await db.lop.findAll();
    if (!classes || classes.length === 0) {
      throw new Error('Cơ sở dữ liệu trống');
    }
    return classes;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách lớp: ' + error.message);
  }
};

// Hàm lấy lớp học theo ID
const getClassById = async (id) => {
  try {
    const oneClass = await db.lop.findByPk(id);
    if (!oneClass) {
      throw new Error(`Không tìm thấy lớp với ID: ${id}`);
    }
    return oneClass;
  } catch (error) {
    throw new Error('Lỗi khi tìm lớp theo ID: ' + error.message);
  }
};

// Kiểm tra lớp đã tồn tại chưa (dựa trên tên lớp)
const checkClassExists = async (className) => {
  try {
    const existingClass = await db.lop.findOne({
      where: { TenLop: className }
    });
    return existingClass !== null; // Trả về true nếu lớp đã tồn tại, ngược lại trả về false
  } catch (error) {
    throw new Error('Lỗi khi kiểm tra lớp: ' + error.message);
  }
};

// Hàm tạo lớp học mới
const createClass = async (data) => {
  try {
    const newClass = await db.lop.create(data);
    return newClass;
  } catch (error) {
    throw new Error('Lỗi khi tạo lớp mới: ' + error.message);
  }
};

// Hàm cập nhật lớp học
const updateClass = async (id, data) => {
  try {
    const classToUpdate = await db.lop.findByPk(id);
    if (!classToUpdate) {
      throw new Error('Lớp không tồn tại');
    }
    await classToUpdate.update(data);
    return classToUpdate;
  } catch (error) {
    throw new Error('Lỗi khi cập nhật lớp: ' + error.message);
  }
};

// Hàm xóa lớp học
const deleteClass = async (id) => {
  try {
    const deleted = await db.lop.destroy({ where: { MaLop: id } });
    if (!deleted) {
      throw new Error('Lớp không tồn tại');
    }
    return deleted;
  } catch (error) {
    throw new Error('Lỗi khi xóa lớp: ' + error.message);
  }
};


const findClassByName = async (className) => {
  const lop = await db.findOne({where: {TenLop}});
  if(!lop) throw new Error ('Lớp không tồn tại');
  return lop;
}
module.exports = { 
  getAllClasses,
  getClassById,
  checkClassExists,
  createClass,
  updateClass,
  deleteClass ,
  findClassByName
};
