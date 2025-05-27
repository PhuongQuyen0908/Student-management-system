import db from "../models/index";
const { Op, fn, col, where } = require('sequelize');

db.danhsachlop.hasMany(db.ct_dsl, { foreignKey: "MaDanhSachLop" });
db.ct_dsl.belongsTo(db.hocsinh, { foreignKey: "MaHocSinh" });
db.ct_dsl.hasMany(db.quatrinhhoc, { foreignKey: "MaCT_DSL" });
db.quatrinhhoc.belongsTo(db.hocky, { foreignKey: "MaHocKy" });
db.danhsachlop.belongsTo(db.lop, { foreignKey: "MaLop" });
db.ct_dsl.belongsTo(db.danhsachlop, { foreignKey: "MaDanhSachLop" });
db.lop.hasMany(db.danhsachlop, { foreignKey: "MaLop" });

const getAllStudentWithSearch = async (search, page, limit) => {
  const offset = (page - 1) * limit;
  try {
    // Nếu search không rỗng thì tạo điều kiện tìm kiếm
    const whereClause = search
      ? {
          [Op.or]: [
            { MaHocSinh: isNaN(Number(search)) ? -1 : Number(search) },
            { HoTen: { [Op.like]: `%${search}%` } },
            where(fn("DATE_FORMAT", col("NgaySinh"), "%Y-%m-%d"), { //chuyển đổi NgàySinh sang định dạng YYYY-MM-DD để so sánh
              [Op.like]: `%${search}%`,
            }),
            { GioiTinh: { [Op.like]: `%${search}%` } },
            { DiaChi: { [Op.like]: `%${search}%` } },
            { Email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await db.hocsinh.findAndCountAll({
      where: whereClause, // <-- Thêm dòng này để lọc theo search
      offset: offset,
      limit: limit,
      attributes: [
        "MaHocSinh",
        "HoTen",
        "Email",
        "GioiTinh",
        "DiaChi",
        "NgaySinh",
      ],
      order: [["MaHocSinh", "DESC"]],
    });

    let totalPages = Math.ceil(count / limit); // tính tổng số trang
    let data = {
      totalRow: count,
      totalPages: totalPages,
      users: rows,
    };

    return {
      EM: "fetch ok",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "Lỗi từ service",
      EC: -1, // nên trả mã lỗi khác 0 để dễ biết có lỗi
      DT: [],
    };
  }
};

//code chạy rồi không cần tối ưu lại
const getAllStudentWithYear = async (yearId, page, limit) => {
  try {
    let offset = (page - 1) * limit; // tính offset cho phân trang
    const dslList = await db.danhsachlop.findAll({
      where: { MaNamHoc: yearId },
      include: [
        {
          model: db.ct_dsl,
          include: [
            {
              model: db.hocsinh,
              attributes: ["MaHocSinh", "HoTen"],
            },
            {
              model: db.quatrinhhoc,
              include: [
                {
                  model: db.hocky,
                  attributes: ["TenHocKy"],
                },
              ],
              attributes: ["DiemTBHocKy"],
            },
          ],
        },
        {
          model: db.lop,
          attributes: ["MaLop", "TenLop"],
        },
      ],
    });

    let students = [];

    dslList.forEach((dsl) => {
      dsl.ct_dsls?.forEach((ct) => {
        if (!ct.hocsinh) return;

        const hk1 = ct.quatrinhhocs?.find(
          (q) => q.hocky?.TenHocKy === "Học kỳ 1"
        );
        const hk2 = ct.quatrinhhocs?.find(
          (q) => q.hocky?.TenHocKy === "Học kỳ 2"
        );

        students.push({
          MaHocSinh: ct.hocsinh.MaHocSinh,
          HoTen: ct.hocsinh.HoTen,
          MaLop: dsl.lop?.MaLop || null,
          TenLop: dsl.lop?.TenLop || null,
          DiemTB_HK1: hk1 ? hk1.DiemTBHocKy : null,
          DiemTB_HK2: hk2 ? hk2.DiemTBHocKy : null,
        });
      });
    });

    let totalPages = Math.ceil(students.length / limit); // tính tổng số trang
    students = students.slice(offset, offset + limit); // phân trang dữ liệu

    let data = {
      totalRow: students.length,
      totalPages: totalPages,
      students: students,
    };
    return {
      EM: "Lấy dữ liệu thành công",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.error(e);
    return {
      EM: "Lỗi từ service",
      EC: -1,
      DT: [],
    };
  }
};

const getAllStudent = async () => {
  try {
    let students = await db.hocsinh.findAll({
      attributes: [
        "MaHocSinh",
        "HoTen",
        "Email",
        "GioiTinh",
        "DiaChi",
        "NgaySinh",
      ],
    });
    if (students) {
      return {
        EM: "Lấy dữ liệu thành công",
        EC: 0,
        DT: students,
      };
    } else {
      return {
        EM: "Lấy dữ liệu thất bại",
        EC: 0,
        DT: [],
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "Lỗi từ service",
      EC: 0,
      DT: [],
    };
  }
};

const getStudentWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit; // tính offset cho phân trang

    const { count, rows } = await db.hocsinh.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: [
        "MaHocSinh",
        "HoTen",
        "Email",
        "GioiTinh",
        "DiaChi",
        "NgaySinh",
      ],
      order: [["MaHocSinh", "DESC"]],
    });

    let totalPages = Math.ceil(count / limit); // tính tổng số trang
    let data = {
      totalRow: count,
      totalPages: totalPages,
      users: rows,
    };
    return {
      EM: "fetch ok",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "Lỗi từ service",
      EC: 0,
      DT: [],
    };
  }
};

const createNewStudent = async (rawStudentData) => {
  try {
    await db.hocsinh.create({
      HoTen: rawStudentData.studentName,
      DiaChi: rawStudentData.studentAddress,
      Email: rawStudentData.studentEmail,
      NgaySinh: rawStudentData.studentBirth,
      GioiTinh: rawStudentData.studentGender,
    });
    return {
      EM: "Tạo học sinh thành công",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Lỗi từ service",
      EC: 1,
      DT: [],
    };
  }
};

const updateStudent = async (data) => {
  try {
    let student = await db.hocsinh.findOne({
      where: { MaHocSinh: data.studentId },
    });
    if (student) {
      //update
      student.update({
        HoTen: data.studentName,
        DiaChi: data.studentAddress,
        Email: data.studentEmail,
        NgaySinh: data.studentBirth,
        GioiTinh: data.studentGender,
      });
      return {
        EM: "Cập nhập học sinh thành công",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Không tìm thấy học sinh",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Lỗi từ service ",
      EC: 1,
      DT: [],
    };
  }
};

const deleteStudent = async (MaHocSinh) => {
  try {
    const deleteCount = await db.hocsinh.destroy({
      where: { MaHocSinh: MaHocSinh },
    });
    if (deleteCount) {
      return {
        EM: "Xóa học sinh thành công",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Học sinh không tồn tại",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Lỗi từ service",
      EC: 1,
      DT: [],
    };
  }
};

module.exports = {
  createNewStudent,
  updateStudent,
  deleteStudent,
  getAllStudent,
  getStudentWithPagination,
  getAllStudentWithYear,
  getAllStudentWithSearch,
};
