import db from '../models/index.js';
import classService from "./classAPIService.js"
import schoolYearService from "./yearAPIService.js"
import paramenterService from "./paramenterAPIService.js";



db.danhsachlop.belongsTo(db.namhoc, { foreignKey: 'MaNamHoc' });
db.danhsachlop.belongsTo(db.lop, { foreignKey: 'MaLop' });
db.danhsachlop.hasMany(db.ct_dsl, { foreignKey: 'MaDanhSachLop' });
db.ct_dsl.belongsTo(db.hocsinh, { foreignKey: 'MaHocSinh' });

import { Op, or } from 'sequelize';

const buildResponse = (EM,EC,DT) => ({EM,EC,DT});
const buildStudentSearchClause = (search) => {
    if (!search || !search.trim()) {
        return {}; // Không tìm kiếm nếu chuỗi rỗng
    }
    const terms= search.trim().split(/\s+/); 
    const orConditions = [];
    for(const term of terms){
      orConditions.push(
        { HoTen: { [Op.like]: `%${term}%` } },
        { Email: { [Op.like]: `%${term}%` } },
        { DiaChi: { [Op.like]: `%${term}%` } },
        { GioiTinh: { [Op.like]: `%${term}%` } },
        { NgaySinh: { [Op.like]: `%${term}%` } },
      )
    }
    return { [Op.or]: orConditions };
}

const getAllStudentOfClass = async (MaDanhSachLop, page, limit, sortField, sortOrder, search) => {
  //Hiển thị danh sách học sinh có tìm kiếm, phân trang, sắp xếp
  try{
    const validFields = ['HoTen', 'Email', 'DiaChi', 'GioiTinh', 'NgaySinh']; // Các trường hợp hợp lệ để sắp xếp
    // Kiểm tra xem sortField có hợp lệ không
    if (!validFields.includes(sortField)) {
      sortField = 'HoTen'; // Mặc định sắp xếp theo HoTen nếu trường không hợp lệ
    }
    sortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Chỉ cho phép ASC hoặc DESC
    const offset = (page - 1) * limit; // Tính toán offset cho phân trang
    const searchClause = buildStudentSearchClause(search); // Tạo điều kiện tìm kiếm
    const {count, rows } = await db.ct_dsl.findAndCountAll({
      where: {
        MaDanhSachLop: MaDanhSachLop //Tìm theo danh sách lớp
      },
      //Lấy các thuộc tính cần thiết từ ct_dsl
      attributes: ['MaCT_DSL', 'MaHocSinh'],
      include: [
        {
        model: db.hocsinh,
        where: searchClause,
        required: true // Sử dụng INNER JOIN để chỉ lấy các kết quả khớp với tìm kiếm
        }
      ],
      offset: offset,
      limit,
      order: [[db.hocsinh, sortField, sortOrder]],
      distinct: true
    });
    const totalPages = Math.ceil(count / limit); // Tính tổng số trang
    const data = {
      totalItems: count,
      totalPages: totalPages,
      currentPage: parseInt(page),
      students: rows.map(item => ({ // map dữ liệu 
          MaCT_DSL: item.MaCT_DSL,
          MaHocSinh: item.hocsinh.MaHocSinh,
          HoTen: item.hocsinh.HoTen,
          Email: item.hocsinh.Email,
          DiaChi: item.hocsinh.DiaChi,
          GioiTinh: item.hocsinh.GioiTinh,
          NgaySinh: item.hocsinh.NgaySinh,
      })),
      sortField: sortField,
      sortOrder: sortOrder,
    };

    if(data.students.length === 0){
      return buildResponse('Không tìm thấy học sinh',1,data);
    }
    return buildResponse('Lấy danh sách học sinh',0,data);
  }catch (e){
    console.log(e.message);
    return buildResponse('Lỗi phía server. Lấy dữ liệu thất bại', -1, []); 
  }
}
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

const createClassList = async ({ TenLop, TenNamHoc }) => {
  try {
    if (!TenLop || !TenNamHoc) {
      return buildResponse('Thiếu thông tin lớp hoặc năm học', 1, []);
    }

    // Kiểm tra tồn tại
    const classExists = await classService.checkClassExists(TenLop);
    if (!classExists) {
      return buildResponse('Không tìm thấy lớp học', 1, []);
    }

    const yearExists = await schoolYearService.checkSchoolYearExists(TenNamHoc);
    if (!yearExists) {
      return buildResponse('Không tìm thấy năm học', 1, []);
    }

    // Truy vấn lấy chi tiết MaLop và MaNamHoc
    const lop = await db.lop.findOne({ where: { TenLop } });
    const namhoc = await db.namhoc.findOne({ where: { TenNamHoc } });

    if (!lop || !namhoc) {
      return buildResponse('Không thể truy xuất thông tin lớp hoặc năm học', 1, []);
    }

    // Kiểm tra trùng
    const existing = await db.danhsachlop.findOne({
      where: {
        MaLop: lop.MaLop,
        MaNamHoc: namhoc.MaNamHoc
      }
    });

    if (existing) {
      return buildResponse('Danh sách lớp đã tồn tại, không thể tạo mới', 1, existing);
    }

    // Tạo mới
    const created = await db.danhsachlop.create({
      MaLop: lop.MaLop,
      MaNamHoc: namhoc.MaNamHoc,
      SiSo: 0
    });

    return buildResponse('Tạo danh sách lớp thành công', 0, created);

  } catch (error) {
    console.error("Lỗi createClassList:", error);
    return buildResponse('Lỗi phía server: ' + error.message, -1, []);
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
      return buildResponse('Không tìm thấy danh sách lớp', 1, []);
    }
    return buildResponse('Thành công', 0, danhSach);
  } catch (error) {
    return buildResponse('Lỗi khi lấy danh sách lớp', -1, []); 
  }
};

// Add student to class
// const addStudentToClass = async (MaDanhSachLop, MaHocSinh) => {
//   const t = await db.sequelize.transaction();
//   try {

//     // 1. Lấy tất cả các tham số 
//     const paramsResponse = await parameterService.getAllParamenter(); 
    
//     // 2. Kiểm tra kết quả trả về từ service
//     if (paramsResponse.EC !== 0 || !paramsResponse.DT) {
//         throw new Error('Không thể tải các quy định của hệ thống.');
//     }

//     // 3. Tìm tham số siSoToiDa
//     const paramenterList = paramsResponse.DT;
//     const siSoToiDaParam = paramenterList.find(param => param.TenThamSo === 'siSoToiDaParam');
//     if (!siSoToiDaParam  || !siSoToiDaParam.GiaTri) {
//       throw new Error('Không tìm thấy tham số siSoToiDaParam trong hệ thống.');
//     }
//     // 4. Kiểm tra số lượng học sinh trong lớp
//     const siSoToiDa = parseInt(siSoToiDaParam.GiaTri, 10);

//     // Check if student already exists in the class
//     const existingRecord = await db.ct_dsl.findOne({
//       where: {
//         MaDanhSachLop,
//         MaHocSinh
//       }
//     });
    
//     if (existingRecord) {
//       return buildResponse('Học sinh đã tồn tại trong danh sách lớp. Không thể thêm', 1,existingRecord);
//     }
    
//     // Add student to class
//     const newRecord = await db.ct_dsl.create({
//       MaDanhSachLop,
//       MaHocSinh
//     });
    
//     // Update class size
//     const classList = await db.danhsachlop.findByPk(MaDanhSachLop);
//     if (classList) {
//       await classList.update({
//         SiSo: (classList.SiSo || 0) + 1
//       });
//     }

//     return buildResponse('Thêm học sinh vào lớp thành công', 0, newRecord);
//   } catch (error) {
//     return buildResponse('Lỗi thêm học sinh vào lớp: ' + error.message, -1, []);
//   }
// };

const addStudentToClass = async ({MaDanhSachLop, MaHocSinh, TenLop, TenNamHoc }) => {
  const t = await db.sequelize.transaction();
  try {
    //1.  Nếu có MaDanhSachLop thì lấy MaDanhSachLop từ tham số, nếu không thì lấy từ tên lớp và năm học
    let classList = null;
    if (MaDanhSachLop) {
      classList = await db.danhsachlop.findByPk(
        MaDanhSachLop, { transaction: t });
    }
    //2. Nếu không có MaDanhSachLop thì lấy từ tên lớp và năm học
    if (!classList) {
      if(!TenLop || !TenNamHoc) {
        await t.rollback();
        return buildResponse('Thiếu thông tin lớp hoặc năm học', 1, null);
      }
      // Tìm MaLop, MaNaHoc từ tên lớp và năm học
      const lop = await db.lop.findOne({ where: { TenLop }, transaction: t });
      const namhoc = await db.namhoc.findOne({ where: { TenNamHoc }, transaction: t });
      if (!lop || !namhoc) {
        await t.rollback();
        return buildResponse('Không tìm thấy lớp hoặc năm học', 1, null);
      }
      //Kiểm tra danh sách lớp đã tồn tại chưa
      classList = await db.danhsachlop.findOne({
        where: {
          MaLop: lop.MaLop,
          MaNamHoc: namhoc.MaNamHoc
        },
        transaction: t
      });
      //Nếu vẫn chưa có ==> Tạo mới
      if (!classList) {
        classList = await db.danhsachlop.create({
          MaLop: lop.MaLop,
          MaNamHoc: namhoc.MaNamHoc,
          SiSo: 0 // Khởi tạo sĩ số là 0
        }, { transaction: t });
      }
    }

    //3. Kiểm tra xem học sinh đã có trong danh sách lớp nào khác trong năm học chưa
    const studentAlreadyInClass = await db.ct_dsl.findOne({
      where: {MaHocSinh},
      include: [{
        model: db.danhsachlop,
        include: [
          {model: db.lop, attributes: ['TenLop']},
          {model: db.namhoc, attributes: ['TenNamHoc']}
        ],
        where: {
          MaNamHoc: classList.MaNamHoc // Chỉ kiểm tra trong cùng năm học
        }
      }],
      transaction: t
    });

    if (studentAlreadyInClass) {
      const tenLop = studentAlreadyInClass.danhsachlop.lop.TenLop;
      const tenNamHoc = studentAlreadyInClass.danhsachlop.namhoc.TenNamHoc;
      // Nếu học sinh đã có trong danh sách lớp khác trong năm học này
      await t.rollback();
      return buildResponse(`Học sinh đã tồn tại trong danh sách lớp '${tenLop}' - Năm học ${tenNamHoc}. Không thể thêm`, 1, studentAlreadyInClass);
    }
    // 4. Kiểm tra tình trạng học sinh (thêm một cột mới vào model học sinh)
    const hs = await db.hocsinh.findByPk(MaHocSinh, { transaction: t });
    if (!hs || ( hs.TrangThaiHoc !== 'Đang học' && hs.TrangThaiHoc !== null)) { 
      await t.rollback();
      const trangThaiHoc = hs ? hs.TrangThaiHoc : null;
      return buildResponse(`Học sinh có tình trạng học: ${trangThaiHoc}. Không thể thêm`, 1, null);
    }

    // Kiểm tra sỉ số tối đa
    const paramsResponse = await paramenterService.getAllParamenter(); 
    
    // 2. Kiểm tra kết quả trả về từ service
    if (paramsResponse.EC !== 0 || !paramsResponse.DT) {
        throw new Error('Không thể tải các quy định của hệ thống.');
    }

    // 3. Tìm tham số "SiSoToiDa" trong mảng DT (Data)
    const parameterList = paramsResponse.DT;
    const siSoToiDaParam = parameterList.find(p => p.TenThamSo === 'SiSoToiDa');

    if (!siSoToiDaParam || !siSoToiDaParam.GiaTri) {
      throw new Error('Không tìm thấy quy định về Sĩ số tối đa.');
    }
    const siSoToiDa = parseInt(siSoToiDaParam.GiaTri, 10);


    // 4. Lấy thông tin lớp học hiện tại và khóa nó lại để tránh race condition
    const classListLock = await db.danhsachlop.findByPk(MaDanhSachLop, {
      transaction: t,
      lock: t.LOCK.UPDATE 
    });

    if (!classListLock) {
      await t.rollback();
      return buildResponse('Không tìm thấy danh sách lớp.', 1, null);
    }

    // 5. So sánh sĩ số hiện tại với sĩ số tối đa đã lấy được
    if (classListLock.SiSo >= siSoToiDa) {
      await t.rollback();
      return buildResponse(`Lớp đã đạt sĩ số tối đa (${siSoToiDa}). Không thể thêm học sinh.`, 2, null);
    }
    
    // 6. Kiểm tra học sinh đã có trong lớp chưa
    const existingRecord = await db.ct_dsl.findOne({
      where: { MaDanhSachLop, MaHocSinh },
      transaction: t
    });
    
    if (existingRecord) {
      await t.rollback();
      return buildResponse('Học sinh đã tồn tại trong danh sách lớp. Không thể thêm', 1, existingRecord);
    }
    
    // 7. Thêm học sinh vào lớp (ct_dsl)
    const newRecord = await db.ct_dsl.create({
      MaDanhSachLop,
      MaHocSinh
    }, { transaction: t });
    
    // 8. Cập nhật lại sĩ số của lớp
    await classList.increment('SiSo', { by: 1, transaction: t });

    // 9. Tạo quá trình học (quatrinhhoc) cho học sinh mới
    const allHocKy = await db.hocky.findAll({transaction: t});
    for (const hocKy of allHocKy) {
      // Tạo bản ghi quatrinhhoc nếu chưa tồn tại
      const [qth] = await db.quatrinhhoc.findOrCreate({
        where: {
          MaCT_DSL: newRecord.MaCT_DSL,
          MaHocKy: hocKy.MaHocKy
        },
        defaults: {
          DiemTB: 0, // Giá trị mặc định
        },
        transaction: t
      });

      //Tạo bản ghi bdmonhoc cho từng môn học trong quá trình học
      const allMonHoc = await db.monhoc.findAll({transaction: t});
      for (const monHoc of allMonHoc) {
        await db.bdmonhoc.findOrCreate({
          where: {
            MaQuaTrinhHoc: qth.MaQuaTrinhHoc,
            MaMonHoc: monHoc.MaMonHoc
          },
          defaults: {
            DiemTP: 0, // Giá trị mặc định
          },
          transaction: t
        });
      }
    }

    // Nếu mọi thứ thành công, commit transaction
    await t.commit();

    return buildResponse('Thêm học sinh vào lớp thành công', 0, newRecord);
  } catch (error) {
    // Nếu có bất kỳ lỗi nào, rollback tất cả thay đổi
    await t.rollback();
    console.error("Lỗi khi thêm học sinh:", error);
    return buildResponse('Lỗi phía server: ' + error.message, -1, null);
  }
};

// Remove student from class
const removeStudentFromClass = async (MaCT_DSL) => {
  try {
    // Begin a transaction
    const t = await db.sequelize.transaction();
    try {
      // 1. Kiểm tra tồn tại
      const ct = await db.ct_dsl.findByPk(MaCT_DSL, { transaction: t });
      if (!ct) {
        await t.rollback();
        return buildResponse('Không tìm thấy học sinh trong danh sách lớp', 1, null);
      }
      // 2. Lấy tất cả các quá trình học liên quan đến học sinh này
      const quaTrinhHocList = await db.quatrinhhoc.findAll({
        where: { MaCT_DSL },
        transaction: t
      });
      const maQTHs = quaTrinhHocList.map(qth => qth.MaQuaTrinhHoc);
      // 3. Lấy tất cả bảng điểm môn học liên quan đến quá trình học này
      const bdmonhocList = await db.bdmonhoc.findAll({
        where: { MaQuaTrinhHoc: { [Op.in]: maQTHs }},
        transaction: t
      });
      const maBDs = bdmonhocList.map(bdmh => bdmh.MaBDMonHoc);
      
         // 4. Kiểm tra còn điểm thành phần nào khác null không
    let countDiemTP = 0;
    if (maBDs.length > 0) {
      countDiemTP = await db.bdchitietmonhoc.count({
        where: {
          MaBDMonHoc: { [db.Sequelize.Op.in]: maBDs },
          DiemTPMonHoc: { [db.Sequelize.Op.not]: null } // Đổi tên trường nếu cần
        },
        transaction: t
      });
    }

    if (countDiemTP > 0) {
      console.log('>>>>>>>>>> countDiemTP', countDiemTP);
      await t.rollback();
      return {
        EM: 'Không thể xóa học sinh khỏi lớp vì vẫn còn điểm thành phần môn học. Vui lòng xóa toàn bộ điểm trước.',
        EC: 1,
        DT: countDiemTP
      };
    }
      //5. Nếu không còn điểm thành phần thì xóa các bản ghi liên quan
      //5.1. Xóa các bản ghi trong bảng chi tiết điểm môn học
      await db.bdchitietmonhoc.destroy({
        where: { MaBDMonHoc: { [Op.in]: maBDs }},
        transaction: t
      });
      //5.2. Xóa các bản ghi trong bảng điểm môn học
      await db.bdmonhoc.destroy({
        where: { MaQuaTrinhHoc: { [Op.in]: maQTHs }},
        transaction: t
      });
      //5.3. Xóa các bản ghi trong bảng quá trình học
      await db.quatrinhhoc.destroy({
        where: { MaCT_DSL },
        transaction: t
      });
      //5.4. Xóa bản ghi trong bảng chi tiết danh sách lớp
      await db.ct_dsl.destroy({
        where: { MaCT_DSL },
        transaction: t
      });
      //6. Cập nhật sĩ số của lớp
      const classList = await db.danhsachlop.findByPk(ct.MaDanhSachLop, { transaction: t });
      if (classList) {
        await classList.decrement('SiSo', { by: 1, transaction: t });
      }
      // Commit the transaction
      await t.commit();
      // Return success response
      return buildResponse('Xóa học sinh khỏi lớp thành công', 0, null);
    } catch (error) {
      // Rollback the transaction in case of error
      await t.rollback();
      console.error("Lỗi khi xóa học sinh khỏi lớp:", error);
      return buildResponse('Lỗi phía server: ' + error.message, -1, null);
    }
  } catch (error) {
    console.error("Lỗi khi bắt đầu transaction:", error);
    return buildResponse('Lỗi phía server: ' + error.message, -1, null);
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
  removeStudentFromClass,
  getAllStudentOfClass
};
