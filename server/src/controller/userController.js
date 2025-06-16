import userService from "../service/userService";

const readFunc = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let search = req.query.search ? req.query.search : ""; //nếu có seach truyền vào
      //sort 
      let sortField = req.query.sortField;
      let sortOrder = req.query.sortOrder 
      console.log("search là gì ", search);

      let data = await userService.getUserWithPagination(+page, +limit ,search ,sortField, sortOrder); // chuyển thành số để dùng sql
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC, //error code
        DT: data.DT, //data
      });
    } else {
      let data = await userService.getAllUser();
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC, //error code
        DT: data.DT, //data
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", //error message
      EC: "-1", //error code
      DT: "", //data
    });
  }
};

const createFunc = async (req, res) => {
  try {
    let data = await userService.createNewUser(req.body); // chuyển thành số để dùng sql
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC, //error code
      DT: data.DT, //data
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", //error message
      EC: "-1", //error code
      DT: "", //data
    });
  }
};

const updateFunc = async (req, res) => {
  try {
    let data = await userService.updateUser(req.body); 
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC, //error code
      DT: data.DT, //data
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", //error message
      EC: "-1", //error code
      DT: "", //data
    });
  }
};

const deleteFunc = async (req, res) => {
  try {
    let data = await userService.deleteUser(req.body.TenDangNhap);
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC, //error code
        DT: data.DT, //data
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", //error message
      EC: "-1", //error code
      DT: "", //data
    });
  }
};

const getUserAccount = async (req, res) =>{
  let response = await userService.getAvatar(req.user.username);
  //link chạy lấy avatar
  const avatar =response.DT ? `${req.protocol}://${req.get('host')}${response.DT}` : `${req.protocol}://${req.get('host')}/uploads/Default_avatar.png`;

  return res.status(200).json({
    EM: "ok", 
    EC: "0", //error code
    DT: {
      access_token:req.token,
      groupWithPermissions:req.user.groupWithPermissions,
      username:req.user.username,
      HoTen:req.user.HoTen,
      Avatar: avatar //trả về đường dẫn avatar
    }
  }); 
}

const changePassword = async (req, res) => {
  try {
    const {TenDangNhap, MatKhauCu, MatKhauMoi , XacNhanMatKhau} = req.body;
    let data = await userService.changePasswordUser(TenDangNhap, MatKhauCu, MatKhauMoi , XacNhanMatKhau);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", //error message
      EC: "-1", //error code
      DT: "", //data
    });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const username = req.body.TenDangNhap;
    const avatarPath = `/uploads/${req.file.filename}`;

    // Lưu đường dẫn avatar vào database nếu muốn
    let data = await userService.updateAvatar(username, avatarPath);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC, //error code
      DT: data.DT, //data
    })} catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", //error message
      EC: "-1", //error code
      DT: "", //data
    });}
};
module.exports = {
  getUserAccount,
  readFunc,
  createFunc,
  updateFunc,
  deleteFunc,
  changePassword,
  uploadAvatar
};
