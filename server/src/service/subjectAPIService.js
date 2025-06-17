import db from '../models/index.js';
const { Op, fn, col, where } = require("sequelize");
const buildResponse = (EM, EC, DT) => ({ EM, EC, DT });


//Cho phép tìm kiếm theo nhiều điều kiện
// Tạo điều kiện tìm kiếm cho nhiều trường
const buildSearchClause = (search) => {
  if (!search) return {};

  const terms = search.trim().split(/\s+/); // tách theo dấu cách
  const orConditions = [];

  for (const term of terms) {
    // Kiểm tra nếu term là một số
    const isNumber = !isNaN(Number(term));

    if (isNumber) {
      orConditions.push(
        { MaMonHoc: Number(term) },
        { HeSo: Number(term) }
      );
    }

    orConditions.push({
      TenMonHoc: { [Op.like]: `%${term}%` }
    });
  }

  return { [Op.or]: orConditions };
};

const getAllSubjectWithSearch = async (search, page,limit, sortField, sortOrder) => {
  try {
    const validFiels = ['MaMonHoc', 'TenMonHoc', 'HeSo']; // Các trường hợp hợp lệ để sắp xếp
    // Kiểm tra xem sortField có hợp lệ không
    if (!validFiels.includes(sortField)) {
      console.warn(`Trường sắp xếp không hợp lệ: ${sortField}`);
      sortField = 'MaMonHoc'; // Mặc định sắp xếp theo MaMonHoc nếu trường không hợp lệ
    }
    sortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Chỉ cho phép ASC hoặc DESC
    const offset = (page - 1) * limit; // Tính toán offset cho phân trang
    const whereClause = buildSearchClause(search); // Tạo điều kiện tìm kiếm
    const { count, rows } = await db.monhoc.findAndCountAll({
      where: whereClause, // Sử dụng điều kiện tìm kiếm
      offset: offset,
      limit: limit,
      order: [[sortField, sortOrder]], // Sắp xếp theo trường và thứ tự
      attributes: [
        'MaMonHoc', 
        'TenMonHoc',
        'HeSo'
      ]
    });
    const totalPages = Math.ceil(count / limit); // Tính tổng số trang
    const data = {
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      subjects: rows,
      sortField: sortField,
      sortOrder: sortOrder
    };
    if (rows.length === 0) {
      //EC = 1: Không tìm thấy môn học nào
      return buildResponse('Không tìm thấy môn học nào', 1, data);
    }else{
      //EC = 0: Lấy danh sách môn học thành công
      return buildResponse('Lấy danh sách môn học thành công', 0, data);
    }
  }catch (error) {
    console.log(error.message);
    // Nếu có lỗi xảy ra, trả về thông báo lỗi
    return buildResponse('Lỗi phía server. Lấy dữ liệu thất bại', -1, []);
  }
}

const getAllSubjects = async () => {
  try {
    const subject = await db.monhoc.findAll({});
    console.log("Check debug", subject);
    if (!subject || subject.length === 0) {
      return buildResponse('Cơ sở dữ liệu trống', 1, []);
    }
    return buildResponse('Lấy danh sách môn học thành công', 0, subject);
  }catch (error){
    console.log(error.message);
    return buildResponse('Lỗi phía server. Lấy dữ liệu thất bại', -1, []);
  }
}
const getAllSubjectsWithPagination = async (page, limit, sortField, sortOrder) => {
  try {
    const validFields = ['MaMonHoc', 'TenMonHoc', 'HeSo'];
    if (!validFields.includes(sortField)) {
      console.warn(`sortField "${sortField}" không hợp lệ. Dùng mặc định "MaMonHoc"`);
      sortField = 'MaMonHoc';
    }

    sortOrder = (sortOrder || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const offset = (page - 1) * limit;
    const { count, rows } = await db.monhoc.findAndCountAll({
      offset,
      limit,
      order: [[sortField, sortOrder]],
      attributes: ['MaMonHoc', 'TenMonHoc', 'HeSo']
    });

    const totalPages = Math.ceil(count / limit);
    const data = {
      totalItems: count,
      totalPages,
      currentPage: page,
      subjects: rows,
      sortField,
      sortOrder
    };

    return buildResponse('Lấy danh sách môn học thành công', 0, data);
  } catch (error) {
    console.error('Lỗi phía server:', error);
    return buildResponse('Lỗi phía server. Lấy dữ liệu thất bại', -1, []);
  }
};

// Hàm lấy môn học học theo ID
const getSubjectById = async (id) => {
  try {
    const subject = await db.monhoc.findByPk(id);
    if (!subject) {
      return buildResponse('Môn học không tồn tại', 1, null);
    }
    return buildResponse('Lấy môn học thành công', 0, subject);
  } catch (error) {
    console.error('Lỗi khi lấy môn học:', error);
    return buildResponse('Lỗi phía server. Lấy dữ liệu thất bại', -1, null);
  }
};

// Kiểm tra môn học đã tồn tại chưa (dựa trên tên môn học)
const checkSubjectExists = async (subjectName) => {
  try {
    const existingSubject = await db.monhoc.findOne({
      where: { TenMonHoc: subjectName }
    });
    if (existingSubject) {
      return buildResponse('Môn học đã tồn tại', 0, existingSubject);
    }
    return buildResponse('Môn học không tồn tại', 1, null);
  } catch (error) {
    console.error('Lỗi khi kiểm tra môn học:', error);
    return buildResponse('Lỗi phía server. Kiểm tra thất bại', -1, null);
  }
};

// Hàm tạo môn học học mới
const createSubject = async (data) => {
  try {
    const newSubject = await db.monhoc.create(data);
    return buildResponse('Tạo môn học thành công', 0, newSubject);
  } catch (error) {
    console.error('Lỗi khi tạo môn học:', error);
    return buildResponse('Lỗi phía server. Tạo môn học thất bại', -1, null);
  }
};

// Hàm cập nhật môn học học
const updateSubject = async (id, data) => {
  try {
    const SubjectToUpdate = await db.monhoc.findByPk(id);
    if (!SubjectToUpdate) {
      return buildResponse('Môn học không tồn tại', 1, null);
    }
    await SubjectToUpdate.update(data);
    return buildResponse('Cập nhật môn học thành công', 0, SubjectToUpdate);
  } catch (error) {
    console.error('Lỗi khi cập nhật môn học:', error);
    return buildResponse('Lỗi phía server. Cập nhật môn học thất bại', -1, null);
  }
};

// Hàm xóa môn học học
const deleteSubject = async (id) => {
  try {
    const deleted = await db.monhoc.destroy({ where: { MaMonHoc: id } });
    if (!deleted) {
      return buildResponse('Môn học không tồn tại', 1, null);
    }
    return buildResponse('Xóa môn học thành công', 0, null);
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      const constraint = error.index || error.parent.constraint || 'unknown';
      const table = error.table || 'unknown';
      return buildResponse(`Không thể xóa môn học vì có ràng buộc với bảng ${table} (constraint: ${constraint})`, 1, null);
    }
    return buildResponse('Lỗi phía server. Xóa môn học thất bại', -1, null);
  }
};

module.exports = { 
  getAllSubjectWithSearch,
  getAllSubjects,
  getAllSubjectsWithPagination,
  getSubjectById,
  checkSubjectExists,
  createSubject,
  updateSubject,
  deleteSubject
};
