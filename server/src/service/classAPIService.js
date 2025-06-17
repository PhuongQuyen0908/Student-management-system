import db from '../models/index.js';
import { Op } from 'sequelize';
const buildResponse = (EM, EC, DT) => ({ EM, EC, DT });

const buildSearchClause = (search) => {
  if (!search) return {};
  const terms = search.trim().split(/\s+/); 
  const orConditions = [];

  for (const term of terms) {
    const isNumber = !isNaN(Number(term));
    if (isNumber && term.trim() !== '') {
      orConditions.push(
        { MaLop: Number(term) },
        { MaKhoi: Number(term) }
      );
    }
    orConditions.push(
      { TenLop: { [Op.like]: `%${term}%` } },
      { '$khoi.TenKhoi$': { [Op.like]: `%${term}%` } } // Thêm dòng này để tìm trên tên khối
    );
  }
  return orConditions.length > 0 ? { [Op.or]: orConditions } : {};
};

const getAllClassesWithSearch = async (search, page, limit, sortField, sortOrder) => {
  try {
    const validFields = ['MaLop', 'TenLop', 'MaKhoi']; // Các trường hợp hợp lệ để sắp xếp
    // Kiểm tra xem sortField có hợp lệ không 
    if (!validFields.includes(sortField)) {
      console.warn(`Trường sắp xếp không hợp lệ: ${sortField}`);
      sortField = 'MaLop'; // Default sort field
    }
    sortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Chỉ cho phép ASC hoặc DESC

    const offset = (page - 1) * limit;
    const searchClause = buildSearchClause(search);
    const { count, rows } = await db.lop.findAndCountAll({
      where: searchClause,
      limit,
      offset,
      order: [[sortField, sortOrder]],
      attributes: ['MaLop', 'TenLop', 'MaKhoi'],
      include: [
        {
          model: db.khoi,
          as: 'khoi',
          attributes: ['MaKhoi', 'TenKhoi'], // Chỉ lấy các trường cần thiết từ bảng khoi
        },
      ],
    });
    const totalPages = Math.ceil(count / limit); // Tính tổng số trang
    const data = {
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      classes: rows,
      sortField: sortField,
      sortOrder: sortOrder,
    };
    if( rows.length === 0) {
      return buildResponse("Không tìm thấy lớp học nào", 1, data);
    }else{
      return buildResponse("Lấy danh sách lớp học thành công", 0, data);
    }
  } catch (error) {
    console.error("Lỗi khi tìm kiếm và phân trang:", error);
    return buildResponse("Lỗi phía server. Lấy dữ liệu thất bại", -1, []);
  }
};

const getAllClasses = async () => {
  try {
    const classes = await db.lop.findAll();
    if (classes.length === 0) {
      return buildResponse("Không tìm thấy lớp học nào", 1, []);
    }
    else {
      return buildResponse("Lấy danh sách lớp học thành công", 0, classes);
    }
  } catch (error) {
    console.log("Lỗi khi lấy danh sách lớp học:", error);
    return buildResponse("Lỗi phía server. Lấy dữ liệu thất bại", -1, []);
  }
};

const getClassWithPagination = async (page, limit, sortField,sortOrder) => {
  try {
    const validFields = ['MaLop', 'TenLop', 'MaKhoi']; // Các trường hợp hợp lệ để sắp xếp
    // Kiểm tra xem sortField có hợp lệ không
    if (!validFields.includes(sortField)) {
      console.warn(`Trường sắp xếp không hợp lệ: ${sortField}`);
      sortField = 'MaLop'; // Mặc định sắp xếp theo MaLop nếu trường không hợp lệ
    }
    sortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Chỉ cho phép ASC hoặc DESC
    const offset = (page - 1) * limit; // Tính toán offset cho phân trang
    const { count, rows } = await db.lop.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [[sortField, sortOrder]], // Sắp xếp theo trường và thứ tự
      attributes: ['MaLop', 'TenLop', 'MaKhoi'],
      include: [
        {
          model: db.khoi,
          as: 'khoi',
          attributes: ['MaKhoi', 'TenKhoi'], // Chỉ lấy các trường cần thiết từ bảng khoi
        },
      ],
    });
    const totalPages = Math.ceil(count / limit); // Tính tổng số trang
    const data = {
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      classes: rows,
      sortField: sortField,
      sortOrder: sortOrder,
    };
    if (rows.length === 0) {
      return buildResponse("Không tìm thấy lớp học nào", 1, data);
    } else {
      return buildResponse("Lấy danh sách lớp học thành công", 0, data);
    }
  } catch (error) {
    console.error("Lỗi khi phân trang:", error);
    return buildResponse("Lỗi phía server. Lấy dữ liệu thất bại", -1, []);
  }
}


const createClass = async (data) => {
  try {
    const newClass = await db.lop.create({
      TenLop: data.className,
      MaKhoi: data.classGrade,
    });
    return buildResponse("Tạo lớp mới thành công", 0, newClass);
  } catch (error) {
    console.error("Lỗi khi tạo lớp mới:", error);
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
    // const count = await db.danhsachlop.count({ 
    //   where: {
    //     MaLop: id,
    //     siso: {
    //       [Op.ne]: 0
    //     }
    //   }
    // });
    // if(count > 0){
    //   return buildResponse("Không thể xóa lớp do đang tồn tại danh sách lớp", 1, []);
    // }
    //   // Xóa các danh sách lớp liên quan (sĩ số = 0 thì mới tới đây)
    // await db.danhsachlop.destroy({
    //   where: { MaLop: id }
    // });
    // Thực hiện xóa lớp học
    const deleted = await db.lop.destroy({ where: { MaLop: id } });
    if (deleted === 1){
      return buildResponse("Xóa lớp thành công", 0, { id });
    }else {
      return buildResponse("Không tìm thấy lớp với ID: " + id, 1, []);
    }
  } catch (error) {
    //Kiểm tra lỗi ràng buộc khóa chính khóa ngoại
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      const constraint = error.index || error.parent.constraint || 'unknown';
      const table = error.table || 'unknown';
      return buildResponse(`Không thể xóa lớp học vì có ràng buộc với bảng ${table} (constraint: ${constraint})`, 1, []);
    }
    // Lỗi khác
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
    return !!existed; // Trả về true nếu lớp tồn tại, false nếu không
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
  getAllClassesWithSearch,
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
