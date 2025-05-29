import { where } from "sequelize";
import db from "../models/index";
const { Op } = require("sequelize"); // Nhớ import Op

const getAgeLimit = async () => {
  try {
    let age = await db.thamso.findAll({
      where: {
        TenThamSo: {
          [Op.or]: ["TuoiHocSinhToiDa", "TuoiHocSinhToiThieu"],
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
  getAgeLimit,
};
