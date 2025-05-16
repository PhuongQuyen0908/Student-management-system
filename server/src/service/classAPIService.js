// Helper để tạo response thống nhất

import db from '../models/index.js';

const buildResponse = (EM, EC, DT) => ({ EM, EC, DT });

const getAllClasses = async () => {
  try {
    const classes = await db.lop.findAll();
    console.log("Check debug", classes)
    return buildResponse("Lấy dữ liệu thành công", 0, classes);
  } catch (error) {
    console.error(error);
    return buildResponse("Lỗi phía server. Lấy dữ liệu thất bại", -1, []);
  }
};

const getClassWithPagination = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await db.lop.findAndCountAll({ limit, offset });
    return buildResponse("Lấy dữ liệu thành công", 0, {
      totalPages: Math.ceil(count / limit),
      totalRows: count,
      classes: rows,
    });
  } catch (error) {
    console.error("Lỗi khi phân trang:", error);
    return buildResponse("Lỗi phía server. Lấy dữ liệu thất bại", -1, []);
  }
};

const createClass = async (data) => {
  try {
    const newClass = await db.lop.create({
      TenLop: data.className,
      MaKhoi: data.classGrade,
    });
    return buildResponse("Tạo lớp mới thành công", 0, newClass);
  } catch (error) {
    console.error("Tạo lớp thất bại:", error);
    return buildResponse("Lỗi phía server", -1, []);
  }
};

const updateClass = async (id, data) => {
  console.log("Check data", data)
  console.log("Check id", id)
  try {
    const classToUpdate = await db.lop.findByPk(id);
    if (!classToUpdate) {
      return buildResponse("Lớp không tồn tại", 1, []);
    }
    await classToUpdate.update({
      TenLop: data.className,
      MaKhoi: data.classGrade,
    });
    return buildResponse("Cập nhật lớp học thành công", 0, classToUpdate);
  } catch (error) {
    console.error(error);
    return buildResponse("Lỗi phía server", -1, []);
  }
};

const deleteClass = async (id) => {
  try {
    const deleted = await db.lop.destroy({ where: { MaLop: id } });
    if (!deleted) {
      return buildResponse("Lớp không tồn tại để xóa", 1, []);
    }
    return buildResponse("Xóa lớp thành công", 0, { id });
  } catch (error) {
    console.error(error);
    return buildResponse("Lỗi phía server", -1, []);
  }
};

const getClassById = async (id) => {
  try {
    const oneClass = await db.lop.findByPk(id);
    if (!oneClass) {
      return buildResponse(`Không tìm thấy lớp với ID: ${id}`, 1, []);
    }
    return buildResponse("Tìm thấy lớp học", 0, oneClass);
  } catch (error) {
    console.error(error);
    return buildResponse("Lỗi khi tìm lớp theo ID", -1, []);
  }
};

const checkClassExists = async (className) => {
  try {
    const existed = await db.lop.findOne({ where: { TenLop: className } });
    return existed !== null;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const findClassByName = async (className) => {
  try {
    return await db.lop.findOne({ where: { TenLop: className } });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default {
  getAllClasses,
  buildResponse,
  getClassWithPagination,
  createClass,
  updateClass,
  deleteClass,
  getClassById,
  checkClassExists,
  findClassByName,
};
