import db from "../models/index";

db.danhsachlop.hasMany(db.ct_dsl, { foreignKey: "MaDanhSachLop" });
db.ct_dsl.belongsTo(db.hocsinh, { foreignKey: "MaHocSinh" });
db.ct_dsl.hasMany(db.quatrinhhoc, { foreignKey: "MaCT_DSL" });
db.quatrinhhoc.belongsTo(db.hocky, { foreignKey: "MaHocKy" });
db.danhsachlop.belongsTo(db.lop, { foreignKey: "MaLop" });
db.ct_dsl.belongsTo(db.danhsachlop, { foreignKey: "MaDanhSachLop" });
db.lop.hasMany(db.danhsachlop, { foreignKey: "MaLop" });



//code chạy rồi không cần tối ưu lại
const getAllStudentWithYear = async (yearId, page , limit) => {
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
          attributes: ["MaLop" , "TenLop"],
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
    }
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
    console.log("check data ", data);
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
};
