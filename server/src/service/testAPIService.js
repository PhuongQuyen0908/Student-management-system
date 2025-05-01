import db from '../models/index.js';

const getAllTests = async () => {
  try {
    const tests = await db.loaikiemtra.findAll();
    if (!tests || tests.length === 0) {
      throw new Error('Cơ sở dữ liệu trống');
    }
    return tests;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách loại kiểm tra: ' + error.message);
  }
};


const getTestById = async (id) => {
  try {
    const test = await db.loaikiemtra.findByPk(id);
    if (!test) {
      throw new Error(`Không tìm thấy loại kiểm tra với ID: ${id}`);
    }
    return test;
  } catch (error) {
    throw new Error('Lỗi khi tìm loại kiểm tra theo ID: ' + error.message);
  }
};

const checkTestExists = async (typeOfTestName) => {
  try {
    const existingTest = await db.loaikiemtra.findOne({
      where: { TenLoaiKiemTra: typeOfTestName }
    });
    return existingTest !== null; 
  } catch (error) {
    throw new Error('Lỗi khi kiểm tra loại kiểm tra: ' + error.message);
  }
};


const createTest = async (data) => {
  try {
    const newTest = await db.loaikiemtra.create(data);
    return newTest;
  } catch (error) {
    throw new Error('Lỗi khi tạo loại kiểm tra mới: ' + error.message);
  }
};


const updateTest = async (id, data) => {
  try {
    const TestToUpdate = await db.loaikiemtra.findByPk(id);
    if (!TestToUpdate) {
      throw new Error('loại kiểm tra không tồn tại');
    }
    await TestToUpdate.update(data);
    return TestToUpdate;
  } catch (error) {
    throw new Error('Lỗi khi cập nhật loại kiểm tra: ' + error.message);
  }
};

const deleteTest = async (id) => {
  try {
    const deleted = await db.loaikiemtra.destroy({ where: { MaLoaiKiemTra: id } });
    if (!deleted) {
      throw new Error('loại kiểm tra không tồn tại');
    }
    return deleted;
  } catch (error) {
    throw new Error('Lỗi khi xóa loại kiểm tra: ' + error.message);
  }
};

module.exports = { 
  getAllTests,
  getTestById,
  checkTestExists,
  createTest,
  updateTest,
  deleteTest 
};
