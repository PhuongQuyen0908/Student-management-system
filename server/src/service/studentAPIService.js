import db from "../models/index";

const getAllStudent = async () => {
  try {
    let students = await db.hocsinh.findAll({
      attributes: ["maHS", "HoTen", "Email", "SoDienThoai", "GioiTinh", "DiaChi", "NgaySinh"]
    });
    if (students) {
      return {
        EM: "Lấy dữ liệu thành công",
        EC: 0,
        DT: users,
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
      attributes: ["maHS", "HoTen", "Email", "SoDienThoai", "GioiTinh", "DiaChi", "NgaySinh"],
      order: [["maHS", "DESC"]],
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
      SoDienThoai: rawStudentData.studentPhone,
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
      where: { maHS: data.studentId },
    });
    if (student) {
      //update
      student.update({
        HoTen: data.studentName,
        DiaChi: data.studentAddress,
        SoDienThoai: data.studentPhone,
        Email: data.studentEmail,
        NgaySinh: data.studentBirth,
        GioiTinh: data.studentGender,
      })
      return {
        EM: "Cập nhập học sinh thành công",
        EC: 0,
        DT: '',
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

const deleteStudent = async (maHS) => {
  try {
    const deleteCount = await db.hocsinh.destroy({
      where: { maHS: maHS },
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
};