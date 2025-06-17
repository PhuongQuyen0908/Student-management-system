import db from '../models/index.js';
import { Op } from 'sequelize';

const buildResponse = (EM, EC, DT) => ({ EM, EC, DT });

// Tìm kiếm và phân trang khối lớp
const getAllGradesWithSearch = async (search = "", page = 1, limit = 10, sortField = "MaKhoi", sortOrder = "ASC") => {
  try {
    const offset = (page - 1) * limit;

    // Xây dựng điều kiện tìm kiếm
    const searchClause = search
      ? {
        [Op.or]: [
          { TenKhoi: { [Op.like]: `%${search}%` } },
          { MaKhoi: !isNaN(Number(search)) ? Number(search) : -1 },
        ],
      }
      : {};

    const validFields = ['MaKhoi', 'TenKhoi'];
    if (!validFields.includes(sortField)) {
      sortField = 'MaKhoi';
    }

    sortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const { count, rows } = await db.khoi.findAndCountAll({
      where: searchClause,
      offset,
      limit,
      order: [[sortField, sortOrder]],
      attributes: ['MaKhoi', 'TenKhoi'],
    });

    const totalPages = Math.ceil(count / limit);
    const data = {
      totalItems: count,
      totalPages,
      currentPage: page,
      grades: rows,
      sortField,
      sortOrder,
    };

    if (rows.length === 0) {
      return buildResponse("Không tìm thấy khối nào", 1, data);
    }

    return buildResponse("Lấy danh sách khối thành công", 0, data);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm/phân trang khối:", error);
    return buildResponse("Lỗi phía server. Lấy danh sách khối thất bại", -1, []);
  }
};

// Lấy toàn bộ khối (không phân trang)
const getAllGrades = async () => {
  try {
    const grades = await db.khoi.findAll({
      attributes: ['MaKhoi', 'TenKhoi'],
    });
    return buildResponse("Lấy danh sách khối thành công", 0, grades);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khối:", error);
    return buildResponse("Lỗi phía server. Lấy danh sách khối thất bại", -1, []);
  }
};

// Lấy khối theo tên
const getGradeByName = async (gradeName) => {
  try {
    const grade = await db.khoi.findAll({ where: { TenKhoi: gradeName } });
    if (!grade || grade.length === 0) {
      return buildResponse("Khối không tồn tại", 1, []);
    }
    return buildResponse("Lấy thông tin khối thành công", 0, grade);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khối:", error);
    return buildResponse("Lỗi phía server. Lấy thông tin khối thất bại", -1, []);
  }
};

// Kiểm tra khối tồn tại
const checkGradeExists = async (gradeName) => {
  try {
    const grade = await db.khoi.findOne({ where: { TenKhoi: gradeName } });
    return !!grade;
  } catch (error) {
    console.error("Lỗi khi kiểm tra khối tồn tại:", error);
    return false;
  }
};

// Tạo mới khối
const createGrade = async (data) => {
  try {
    const newGrade = await db.khoi.create({ TenKhoi: data.GradeName });
    return buildResponse("Tạo khối học thành công", 0, newGrade);
  } catch (error) {
    console.error("Lỗi khi tạo khối:", error);
    return buildResponse("Lỗi phía server. Tạo khối thất bại", -1, []);
  }
};

// Cập nhật khối
const updateGrade = async (id, data) => {
  try {
    const gradeToUpdate = await db.khoi.findByPk(id);
    if (!gradeToUpdate) {
      return buildResponse("Khối không tồn tại", 1, []);
    }

    await gradeToUpdate.update({ TenKhoi: data.GradeName });
    return buildResponse("Cập nhật khối học thành công", 0, gradeToUpdate);
  } catch (error) {
    console.error("Lỗi khi cập nhật khối:", error);
    return buildResponse("Lỗi phía server. Cập nhật khối thất bại", -1, []);
  }
};

// Xoá khối
const deleteGrade = async (id) => {
  try {
    const isExist = await db.khoi.findByPk(id);
    if (!isExist) {
      return buildResponse("Không tìm thấy khối nào", 1, []);
    }
    const deletedGrade = await db.khoi.destroy({ where: { MaKhoi: id } });
    if (deletedGrade === 1) {
      return buildResponse("Xóa khối học thành công", 0, []);
    } else {
      return buildResponse("Xóa khối học thất bại", 1, []);
    }
  } catch (error) {
    if (
      error.name === "SequelizeForeignKeyConstraintError" ||
      (error.parent && error.parent.code === "ER_ROW_IS_REFERENCED_2")
    ) {
      const msg = error.parent?.sqlMessage || error.message || "";
      const [, foreignTable = "không xác định", constraintName = "không xác định"] =
        msg.match(/a foreign key constraint fails \(`[^`]+`\.`([^`]+)`, CONSTRAINT `([^`]+)`/) || [];
      return buildResponse(
        `Không thể xóa khối vì đang được tham chiếu ở bảng: ${foreignTable} (ràng buộc: ${constraintName})`,
        2,
        { foreignTable, constraintName }
      );
    }
    return buildResponse("Lỗi phía server: " + error.message, -1, []);
  }
};

export default {
  getAllGradesWithSearch,
  getAllGrades,
  getGradeByName,
  checkGradeExists,
  createGrade,
  updateGrade,
  deleteGrade,
};
