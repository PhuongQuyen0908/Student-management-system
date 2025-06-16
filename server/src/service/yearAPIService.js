import db from '../models/index.js';
const buildRepsponse = (EM, EC, DT) => ({EM,EC, DT});
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
      where: { TenNamHoc: SchoolYearName }
    });
    if( existingSchoolYear ) {
      return true; // Năm học đã tồn tại
    } else return false; // Năm học chưa tồn tại
  } catch (error) {
    throw new Error('Lỗi khi kiểm tra năm học: ' + error.message);
  }
};

// Hàm tạo năm học học mới
const createSchoolYear = async (data) => {
  try {
    const { TenNamHoc } = data;

    // 1. Validate the format (optional but highly recommended)
    if (!TenNamHoc || !/^\d{4}-\d{4}$/.test(TenNamHoc)) {
      return buildRepsponse('Tên năm học không hợp lệ. Vui lòng nhập theo định dạng YYYY-YYYY', 1, null);
    }

    // 2. Split the string to get the two years
    const years = TenNamHoc.split('-');
    const nam1 = years[0];
    const nam2 = years[1];
    if(nam1 >= nam2){
      return buildRepsponse('Năm bắt đầu phải nhỏ hơn năm kết thúc', 1, null);
    }
    // 3. Create the complete data object to be saved
    const schoolYearDataToCreate = {
      TenNamHoc: TenNamHoc,
      Nam1: nam1,
      Nam2: nam2,
    };

    // 4. Create the new record using the complete object
    const newSchoolYear = await db.namhoc.create(schoolYearDataToCreate);
    return buildRepsponse('Tạo năm học thành công', 0, newSchoolYear);

  } catch (error) {
    // The original error message from the DB will be caught and re-thrown
    return buildRepsponse('Lỗi khi tạo năm học: ' + error.message, -1, null);}
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
