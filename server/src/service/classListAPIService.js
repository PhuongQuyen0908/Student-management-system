import db from '../models/index.js';
import classService from "./classAPIService.js"
import schoolYearService from "./yearAPIService.js"

db.danhsachlop.belongsTo(db.namhoc, { foreignKey: 'MaNamHoc' });
db.danhsachlop.belongsTo(db.lop, { foreignKey: 'MaLop' });
db.danhsachlop.hasMany(db.ct_dsl, { foreignKey: 'MaDanhSachLop' });
db.ct_dsl.belongsTo(db.hocsinh, { foreignKey: 'MaHocSinh' });

const getAllClassList = async () => {
  try {
    const danhSach = await db.danhsachlop.findAll({
      include: [
        { model: db.namhoc },
        { model: db.lop },
        { 
          model: db.ct_dsl, 
          include: [
            { model: db.hocsinh }
          ]
        }
      ]
    });
    return danhSach;
  } catch (error) {
    throw new Error('Lỗi lấy danh sách lớp: ' + error.message);
  }
};

const getClassListById = async (id) => {
  try {
    const danhSach = await db.danhsachlop.findByPk(id, {
      include: [
        { model: db.namhoc },
        { model: db.lop },
        { 
          model: db.ct_dsl, 
          include: [
            { model: db.hocsinh }
          ]
        }
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
    const namhoc = schoolYearService.checkSchoolYearExists(NamHoc);
    if(!namhoc){
      return json.status(404).json({message: "Không tìm thấy năm học"});
    }
    // Tạo mới danh sách lớp với dữ liệu được truyền vào
    const created = await db.danhsachlop.create({
      MaLop: lop.MaLop,
      MaNamHoc: namhoc.MaNamHoc,
      SiSo: 0 // Default value
    });
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
    const danhSach = await db.danhsachlop.findAll({
      include: [
        { 
          model: db.namhoc, 
          where: { TenNamHoc: namHoc } 
        },
        { 
          model: db.lop, 
          where: { TenLop: tenLop } 
        },
        { 
          model: db.ct_dsl, 
          include: [
            { model: db.hocsinh }
          ]
        }
      ]
    });

    if (danhSach.length === 0) {
      throw new Error('Không tìm thấy danh sách lớp theo tên và năm học');
    }

    return danhSach;
  } catch (error) {
    throw new Error('Lỗi tìm danh sách lớp theo tên và năm học: ' + error.message);
  }
};

// Add student to class
const addStudentToClass = async (MaDanhSachLop, MaHocSinh) => {
  try {
    // Check if student already exists in the class
    const existingRecord = await db.ct_dsl.findOne({
      where: {
        MaDanhSachLop,
        MaHocSinh
      }
    });
    
    if (existingRecord) {
      throw new Error('Học sinh đã tồn tại trong lớp này');
    }
    
    // Add student to class
    const newRecord = await db.ct_dsl.create({
      MaDanhSachLop,
      MaHocSinh
    });
    
    // Update class size
    const classList = await db.danhsachlop.findByPk(MaDanhSachLop);
    if (classList) {
      await classList.update({
        SiSo: (classList.SiSo || 0) + 1
      });
    }
    
    return newRecord;
  } catch (error) {
    throw new Error('Lỗi thêm học sinh vào lớp: ' + error.message);
  }
};

// Remove student from class
const removeStudentFromClass = async (MaCT_DSL) => {
  try {
    // Begin a transaction
    const t = await db.sequelize.transaction();
    
    try {
      // Get the record to find MaDanhSachLop
      const record = await db.ct_dsl.findByPk(MaCT_DSL);
      if (!record) {
        throw new Error('Không tìm thấy học sinh trong lớp');
      }
      
      const MaDanhSachLop = record.MaDanhSachLop;
      
      // Find all quatrinhhoc records for this CT_DSL
      const quaTrinhHocList = await db.quatrinhhoc.findAll({
        where: { MaCT_DSL },
        transaction: t
      });
      
      // For each quaTrinhHoc, delete related bdmonhoc records
      for (const qth of quaTrinhHocList) {
        // Find all bdmonhoc records for this quaTrinhHoc
        const bdMonHocList = await db.bdmonhoc.findAll({
          where: { MaQuaTrinhHoc: qth.MaQuaTrinhHoc },
          transaction: t
        });
        
        // For each bdmonhoc, delete related bdchitietmonhoc records
        for (const bdmh of bdMonHocList) {
          await db.bdchitietmonhoc.destroy({
            where: { MaBDMonHoc: bdmh.MaBDMonHoc },
            transaction: t
          });
        }
        
        // Now delete the bdmonhoc records
        await db.bdmonhoc.destroy({
          where: { MaQuaTrinhHoc: qth.MaQuaTrinhHoc },
          transaction: t
        });
      }
      
      // Now it's safe to delete the quatrinhhoc records
      await db.quatrinhhoc.destroy({
        where: { MaCT_DSL },
        transaction: t
      });
      
      // Then remove student from class
      await record.destroy({ transaction: t });
      
      // Update class size
      const classList = await db.danhsachlop.findByPk(MaDanhSachLop);
      if (classList && classList.SiSo > 0) {
        await classList.update({
          SiSo: classList.SiSo - 1
        }, { transaction: t });
      }
      
      // Commit the transaction
      await t.commit();
      
      return true;
    } catch (error) {
      // Rollback the transaction if there's an error
      await t.rollback();
      throw error;
    }
  } catch (error) {
    throw new Error('Lỗi xóa học sinh khỏi lớp: ' + error.message);
  }
};

export default {
  getAllClassList,
  getClassListById,
  createClassList,
  updateClassList,
  deleteClassList,
  getClassListByNameAndYear,
  addStudentToClass,
  removeStudentFromClass
};
