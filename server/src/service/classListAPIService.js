import db from '../models/index.js';
import classService from "./classAPIService.js"
import schoolYearService from "./yearAPIService.js"

const getAllClassList = async () => {
  try {
    // Lấy toàn bộ danh sách lớp với các liên kết đến 'namhoc' và 'lop'
    const danhSach = await db.danhsachlop.findAll({
      include: [
        { model: db.namhoc, as: 'fk_namhoc' },  // Sử dụng alias 'fk_namhoc' từ mô hình
        { model: db.lop, as: 'fk_lop' }          // Sử dụng alias 'fk_lop' từ mô hình
      ]
    });
    return danhSach;
  } catch (error) {
    throw new Error('Lỗi lấy danh sách lớp: ' + error.message);
  }
};

const getClassListById = async (id) => {
  try {
    // Tìm kiếm theo id và bao gồm các mối quan hệ 'namhoc' và 'lop'
    const danhSach = await db.danhsachlop.findByPk(id, {
      include: [
        { model: db.namhoc, as: 'fk_namhoc' },
        { model: db.lop, as: 'fk_lop' }
      ]
    });
    if (!danhSach) {
      throw new Error('Không tìm thấy danh sách lớp');
    }
    return danhSach;
  } catch (error) {
    throw new Error('Lỗi tìm danh sách lớp: ' + error.message);
  }
};

const createClassList = async ({TenLop,NamHoc}) => {
  try {
    //Validaation đầu vào
    if(!TenLop||!NamHoc){
      throw new Error("Thiếu thông tin");
    }
    // Kiểm tra lớp có tồn tại không
    const lop = classService.checkClassExists(TenLop);
    if(!lop){
      return json.status(404).json({message: "Không tìm thấy lớp học"});
    }
    const namhoc = schoolYearService.checkSchoolYearExxits(NamHoc);
    if(!namhoc){
      return json.status(404).json({message: "Không tìm thấy năm học"});
    }
    // Tạo mới danh sách lớp với dữ liệu được truyền vào
    const created = await db.danhsachlop.create(data);
    return created;
  } catch (error) {
    throw new Error('Lỗi tạo danh sách lớp: ' + error.message);
  }
};

const updateClassList = async (id, data) => {
  try {
    // Tìm danh sách lớp theo id
    const record = await db.danhsachlop.findByPk(id);
    if (!record) {
      throw new Error('Không tìm thấy danh sách lớp để cập nhật');
    }
    // Cập nhật thông tin của danh sách lớp
    await record.update(data);
    return record;
  } catch (error) {
    throw new Error('Lỗi cập nhật danh sách lớp: ' + error.message);
  }
};

const deleteClassList = async (id) => {
  try {
    // Xóa danh sách lớp theo id
    const deleted = await db.danhsachlop.destroy({ where: { MaDanhSachLop: id } });
    if (!deleted) {
      throw new Error('Không tìm thấy danh sách lớp để xóa');
    }
    return deleted;
  } catch (error) {
    throw new Error('Lỗi xóa danh sách lớp: ' + error.message);
  }
};

// Hàm tìm kiếm danh sách lớp theo tên lớp và năm học
const getClassListByNameAndYear = async (tenLop, namHoc) => {
  try {
    // Tìm danh sách lớp với điều kiện tên lớp và năm học
    const danhSach = await db.danhsachlop.findAll({
      include: [
        { model: db.namhoc, as: 'fk_namhoc', where: { NamHoc: namHoc } }, // Điều kiện cho 'namhoc'
        { model: db.lop, as: 'fk_lop', where: { TenLop: tenLop } }        // Điều kiện cho 'lop'
      ]
    });

    // Nếu không có kết quả, trả về thông báo
    if (danhSach.length === 0) {
      throw new Error('Không tìm thấy danh sách lớp theo tên và năm học');
    }

    return danhSach;
  } catch (error) {
    throw new Error('Lỗi tìm danh sách lớp theo tên và năm học: ' + error.message);
  }
};

export default {
  getAllClassList,
  getClassListById,
  createClassList,
  updateClassList,
  deleteClassList,
  getClassListByNameAndYear // Thêm hàm mới vào export
};
