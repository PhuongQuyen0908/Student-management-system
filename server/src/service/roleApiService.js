import db from "../models/index.js";

const getRoleByGroup = async (MaNhom) => {
  try {
    if (!MaNhom) {
      return {
        EM: `Không tìm thấy nhóm`,
        EC: -1,
        DT: [],
      };
    }
    let roles = await db.nhomnguoidung.findOne({
      where: { MaNhom: MaNhom },
      attributes: ["MaNhom", "TenNhom"],
      include: {
        model: db.chucnang,
        attributes: [
          "MaChucNang",
          "TenChucNang",
          "TenManHinhDuocLoad",
          "NhomChucNang",
        ],
        through: { attributes: [] },
      },
    });
    return {
      EM: `Lấy danh sách quyền của nhóm thành công`,
      EC: 0,
      DT: roles,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "error from service",
      EC: 1,
      DT: [],
    };
  }
};

const assignRoleToGroup = async (data) => {
  // gán quyền cho nhóm người dùng
  try {
    //data = groupId:4 , groupRoles:[{},{}]  , groupRoles
    //data truyền lên gồm 2 phần là groupId và groupRoles => cần data.groupRoles

    // tiếng việt : data = MaNhom:4 , DanhSachQuyen:[{},{}]
    //DanhSachQuyen có dạng [{MaNhom:4, MaChucNang:1}, {MaNhom:4, MaChucNang:2}]
    /*
    {
  "MaNhom": 2,
  "DanhSachQuyen": [
    { "MaNhom": 2, "MaChucNang": 1 },
    { "MaNhom": 2, "MaChucNang": 2 },
     { "MaNhom": 2, "MaChucNang": 3 },
      { "MaNhom": 2, "MaChucNang": 4 }
  ]
}
    */
    await db.phanquyen.destroy({
      where: { MaNhom: +data.MaNhom },
    });
    await db.phanquyen.bulkCreate(data.DanhSachQuyen);
    return {
      EM: `Gán quyền cho nhóm thành công`,
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Lỗi từ service",
      EC: -1,
      DT: [],
    };
  }
};
module.exports = {
  getRoleByGroup,
  assignRoleToGroup,
};
