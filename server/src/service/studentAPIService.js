import db from "../models/index";
const { Op, fn, col, where } = require("sequelize");

db.danhsachlop.hasMany(db.ct_dsl, { foreignKey: "MaDanhSachLop" });
db.ct_dsl.belongsTo(db.hocsinh, { foreignKey: "MaHocSinh" });
db.ct_dsl.hasMany(db.quatrinhhoc, { foreignKey: "MaCT_DSL" });
db.quatrinhhoc.belongsTo(db.hocky, { foreignKey: "MaHocKy" });
db.danhsachlop.belongsTo(db.lop, { foreignKey: "MaLop" });
db.ct_dsl.belongsTo(db.danhsachlop, { foreignKey: "MaDanhSachLop" });
db.lop.hasMany(db.danhsachlop, { foreignKey: "MaLop" });


const buildResponse = (EM, EC, DT) => ({ EM, EC, DT });
const getAllStudentWithSearch = async (
  search,
  page,
  limit,
  sortField,
  sortOrder
) => {
  const offset = (page - 1) * limit;
  try {
    // Nếu search không rỗng thì tạo điều kiện tìm kiếm
    const whereClause = search
      ? {
          [Op.or]: [
            { MaHocSinh: isNaN(Number(search)) ? -1 : Number(search) },
            { HoTen: { [Op.like]: `%${search}%` } },
            where(fn("DATE_FORMAT", col("NgaySinh"), "%Y-%m-%d"), {
              //chuyển đổi NgàySinh sang định dạng YYYY-MM-DD để so sánh
              [Op.like]: `%${search}%`,
            }),
            { GioiTinh: { [Op.like]: `%${search}%` } },
            { DiaChi: { [Op.like]: `%${search}%` } },
            { Email: { [Op.like]: `%${search}%` } },
            { TrangThaiHoc: { [Op.like]: `%${search}%` } },
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
        "TrangThaiHoc"
      ],
      order: [[sortField, sortOrder.toUpperCase()]],
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
const getAllStudentWithYear = async (
  yearId,
  page,
  limit,
  search = "",
  sortField,
  sortOrder
) => {
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

    // // Thêm chức năng sort
    if (sortField && sortOrder) {
      students.sort((a, b) => {
        const aField = a[sortField];
        const bField = b[sortField];

        if (aField === null || aField === undefined) return 1;
        if (bField === null || bField === undefined) return -1;

        if (typeof aField === "string" && typeof bField === "string") {
          return sortOrder === "asc"
            ? aField.localeCompare(bField)
            : bField.localeCompare(aField);
        }

        return sortOrder === "asc" ? aField - bField : bField - aField;
      });
    }

    // // Thêm chức năng tìm kiếm ở đây
    //hàm tìm kiếm không phân biệt chữ hoa thường và dấu
    const removeAccents = (str) => {
      return str
        .normalize("NFD") // Tách chữ và dấu
        .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
        .toLowerCase(); // Viết thường
    };
    //nếu có từ để search
    if (search && search.trim() !== "") {
      const searchNormalized = removeAccents(search);

      students = students.filter((s) => {
        const hoTen = removeAccents(s.HoTen || "");
        const tenLop = removeAccents(s.TenLop || "");
        const maHocSinh = removeAccents(s.MaHocSinh?.toString() || "");
        const diemHK1 = removeAccents(s.DiemTB_HK1?.toString() || "");
        const diemHK2 = removeAccents(s.DiemTB_HK2?.toString() || "");

        return (
          hoTen.includes(searchNormalized) ||
          tenLop.includes(searchNormalized) ||
          maHocSinh.includes(searchNormalized) ||
          diemHK1.includes(searchNormalized) ||
          diemHK2.includes(searchNormalized)
        );
      });
    }

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
        "TrangThaiHoc"
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

const getStudentWithPagination = async (page, limit, sortField, sortOrder) => {
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
        "TrangThaiHoc"
      ],
      order: [[sortField, sortOrder.toUpperCase()]],
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
    const existingStudent = await db.hocsinh.findOne({
      where: { 
         Email: rawStudentData.studentEmail
    },
    });
    if (existingStudent) {
      return {
        EM: "Email học sinh đã tồn tại",
        EC: 1,
        DT: [],
      };
    }
    await db.hocsinh.create({
      HoTen: rawStudentData.studentName,
      DiaChi: rawStudentData.studentAddress,
      Email: rawStudentData.studentEmail,
      NgaySinh: rawStudentData.studentBirth,
      GioiTinh: rawStudentData.studentGender,
      TrangThaiHoc: "Đang học"
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
        TrangThaiHoc: data.studentStatus,
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

const isStudentInAnyClass = async (MaHocSinh) => {
  try {
    const dsLop = await db.ct_dsl.findAll({
      where: { MaHocSinh: MaHocSinh },
    });
    if (dsLop.length === 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

const isStudentGraduated = async (MaHocSinh) => {
  try {
    const student = await db.hocsinh.findByPk(MaHocSinh);
    if (student.TrangThaiHoc === "Đã tốt nghiệp") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
const deleteStudent = async (MaHocSinh) => {
  try {
    // 1. Kiểm tra học sinh có tồn tại không
    const student = await db.hocsinh.findByPk(MaHocSinh);
    if (!student) {
      return buildResponse("Không tìm thấy học sinh", 1, []);
    }
    // 2. Lấy tất cả các lớp và năm học mà học sinh này từng thuộc
    const ctDSLs = await db.ct_dsl.findAll({
      where: { MaHocSinh },
      include: [
        {
          model: db.danhsachlop,
          include: [
            { model: db.lop, attributes: ["TenLop"] },
            { model: db.namhoc, attributes: ["TenNamHoc"] }
          ]
        }
      ]
    });

    if (ctDSLs.length > 0) {
      // Lấy ra danh sách lớp và năm học mà học sinh này từng thuộc
      const info = ctDSLs.map(item => {
        const tenLop = item.danhsachlop?.lop?.TenLop || "Không xác định";
        const tenNamHoc = item.danhsachlop?.namhoc?.TenNamHoc || "Không xác định";
        return `${tenLop} (${tenNamHoc})`;
      }).join(", ");
      return buildResponse(
        `Không thể xóa học sinh vì đã hoặc đang thuộc các lớp: ${info}`,
        1,
        []
      );
    }

    // 3. Nếu chưa từng thuộc lớp nào, cho phép xóa
    await db.hocsinh.destroy({ where: { MaHocSinh } });
    return buildResponse("Xóa học sinh thành công", 0, []);
  } catch (error) {
    // Kiểm tra lỗi ràng buộc khóa ngoại
    if (
      error.name === "SequelizeForeignKeyConstraintError" ||
      (error.parent && error.parent.code === "ER_ROW_IS_REFERENCED_2")
    ) {
      const msg = error.parent?.sqlMessage || error.message || "";
      const [, foreignTable = "unknown", constraintName = "unknown"] =
        msg.match(/a foreign key constraint fails \(`[^`]+`\.`([^`]+)`, CONSTRAINT `([^`]+)`/) || [];
      return {
        EM: `Không thể xóa học sinh vì có ràng buộc với bảng ${foreignTable} (constraint: ${constraintName})`,
        EC: 1,
        DT: { foreignTable, constraintName },
      };
    }
    return buildResponse("Lỗi từ service", 1, []);
  }
};
const getAgeLimit = async () => {
  try {
    let age = await db.thamso.findAll({
      where: {
        TenThamSo: {
          [Op.or]: ["TuoiToiDa", "TuoiToiThieu"],
        },
      },
      attributes: ["TenThamSo", "GiaTri"],
    });
    if (age && age.length > 0) {
      return {
        EM: "Lấy dữ liệu thành công",
        EC: 0,
        DT: age,
      };
    } else {
      return {
        EM: "Lấy dữ liệu thất bại",
        EC: -1,
        DT: [],
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "Lỗi từ service",
      EC: -1,
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
  getAgeLimit
};
