import db from "../models/index.js";

const checkUserExist = async (username) => {
  let user = await db.nguoidung.findOne({
    where: { TenDangNhap: username },
  });

  if (user) {
    return true;
  }

  return false;
};

const checkPhoneExist = async (userPhone) => {
  let user = await db.nguoidung.findOne({
    where: { SoDienThoai: userPhone },
  });

  if (user) {
    return true;
  }

  return false;
};

const CheckPhoneUpdate = async (userPhone, TenDangNhap) => {
  let user = await db.nguoidung.findOne({
    where: {
      SoDienThoai: userPhone,
      TenDangNhap: { [db.Sequelize.Op.ne]: TenDangNhap },
    },
  });
  if (user) {
    return true; // Số điện thoại đã được sử dụng bởi người dùng khác
  }
  return false; // Số điện thoại không bị trùng
};

const getAllUser = async () => {
  try {
    let users = await db.nguoidung.findAll({
      attributes: ["TenDangNhap", "SoDienThoai", "HoTen"],
      include: { model: db.nhomnguoidung, attributes: ["TenNhom"] },
    });
    if (users) {
      return {
        EM: "Lấy dữ liệu thành công",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "Lấy dữ liệu thất bại",
        EC: 1,
        DT: [],
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with service",
      EC: 0,
      DT: [],
    };
  }
};

const getUserWithPagination = async (
  page,
  limit,
  search = "",
  sortField,
  sortOrder
) => {
  try {
    let offset = (page - 1) * limit; // tính offset cho phân trang

    // Tạo điều kiện tìm kiếm nếu có
    const whereClause = search
      ? {
          [db.Sequelize.Op.or]: [
            { TenDangNhap: { [db.Sequelize.Op.like]: `%${search}%` } },
            { SoDienThoai: { [db.Sequelize.Op.like]: `%${search}%` } },
            { HoTen: { [db.Sequelize.Op.like]: `%${search}%` } },
            {
              "$nhomnguoidung.TenNhom$": {
                [db.Sequelize.Op.like]: `%${search}%`,
              },
            },
          ],
        }
      : {};

    const { count, rows } = await db.nguoidung.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["TenDangNhap", "SoDienThoai", "HoTen"],
      include: { model: db.nhomnguoidung, attributes: ["MaNhom", "TenNhom"] },
      where: whereClause, // Thêm điều kiện tìm kiếm
      // Sắp xếp theo trường và thứ tự
      order:
        sortField === "TenNhom"
          ? [
              [
                { model: db.nhomnguoidung },
                "TenNhom",
                sortOrder.toUpperCase() || "ASC",
              ],
            ]
          : [[sortField, sortOrder.toUpperCase() || "ASC"]],
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
      EM: "something wrongs with service",
      EC: 0,
      DT: [],
    };
  }
};

const createNewUser = async (data) => {
  try {
    //check null
    const { TenDangNhap, HoTen, SoDienThoai, MatKhau, MaNhom } = data;
    if (!TenDangNhap || !HoTen || !SoDienThoai || !MatKhau || !MaNhom) {
      return {
        EM: "Thiếu thông tin bắt buộc",
        EC: -1,
        DT: "",
      };
    }
    //check email , phone ...
    let isUserExist = await checkUserExist(TenDangNhap);
    if (isUserExist === true) {
      return {
        EM: "Tên đăng nhập đã tồn tại hoặc số điện thoại đã được sử dụng",
        EC: 1,
        DT: "",
      };
    }
    let isPhoneExist = await checkPhoneExist(SoDienThoai);
    if (isPhoneExist === true) {
      return {
        EM: "Tên đăng nhập đã tồn tại hoặc số điện thoại đã được sử dụng",
        EC: 1,
        DT: "",
      };
    }

    await db.nguoidung.create(data);
    return {
      EM: "Tạo người dùng thành công",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (data) => {
  try {
    if (!data.MaNhom) {
      return {
        EM: "MaNhom is required",
        EC: -1,
        DT: "group",
      };
    }
    const isPhoneExist = await CheckPhoneUpdate(
      data.SoDienThoai,
      data.TenDangNhap
    );
    if (isPhoneExist) {
      return {
        EM: "Số điện thoại đã được sử dụng",
        EC: 1,
        DT: "",
      };
    }
    let user = await db.nguoidung.findOne({
      where: { TenDangNhap: data.TenDangNhap },
    });
    if (user) {
      //update
      //không hỗ trợ update tên đăng nhập và mật khẩu
      await user.update({
        SoDienThoai: data.SoDienThoai,
        HoTen: data.HoTen,
        MaNhom: data.MaNhom,
      });
      return {
        EM: "Cập nhật người dùng thành công",
        EC: 0,
        DT: "",
      };
    } else {
      //not found
      return {
        EM: "Không tìm thấy người dùng",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrongs with service",
      EC: -1,
      DT: [],
    };
  }
};

const deleteUser = async (TenDangNhap) => {
  try {
    const deleteCount = await db.nguoidung.destroy({
      where: { TenDangNhap: TenDangNhap },
    });
    if (deleteCount) {
      return {
        EM: "Xóa người dùng thành công",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Người dùng không tồn tại",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "error from service",
      EC: -1,
      DT: [],
    };
  }
};

const checkPassword = (inputPassword, databasePassword) => {
  return inputPassword === databasePassword;
};

const changePasswordUser = async (
  TenDangNhap,
  MatKhauCu,
  MatKhauMoi,
  XacNhanMatKhau
) => {
  try {
    let user = await db.nguoidung.findOne({
      where: { TenDangNhap: TenDangNhap },
    });
    if (MatKhauMoi !== XacNhanMatKhau) {
      return {
        EM: "Mật khẩu mới và mật khẩu xác nhận lại không khớp",
        EC: 1,
        DT: "",
      };
    }
    if (user) {
      let isCorrectPassword = checkPassword(MatKhauCu, user.MatKhau);
      if (isCorrectPassword === true) {
        if (MatKhauMoi === MatKhauCu) {
          return {
            EM: "Mật khẩu mới không được trùng với mật khẩu cũ",
            EC: 1,
            DT: "",
          };
        }
        await user.update({
          MatKhau: MatKhauMoi,
        });
        return {
          EM: "Cập nhật mật khẩu thành công",
          EC: 0,
          DT: "",
        };
      } else {
        //not found
        return {
          EM: "Không tìm thấy người dùng hoặc mật khẩu cũ không đúng",
          EC: 1,
          DT: [],
        };
      }
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrongs with service",
      EC: -1,
      DT: [],
    };
  }
};
module.exports = {
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
  getUserWithPagination,
  changePasswordUser,
};
