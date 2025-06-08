import permissionApiService from "../service/permissionApiService";


const getAllPermissions  = async (req, res) => {
  try {
    let data = await permissionApiService.getAllPermissions();
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
}


const getPermissionBygroup = async (req,res) =>{
  try {
    let MaNhom = req.params.groupId; // lấy MaNhom từ params
    let data = await permissionApiService.getPermissionByGroup(MaNhom);
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
}

const assignPermissionToGroup = async(req,res)=>{
  try {
    console.log(req.body.data);
    let data = await permissionApiService.assignPermissionToGroup(req.body.data); // sau này sửa thành req.body.data
    //data có MaNhom và DanhSachQuyen
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
}

module.exports = {
    getPermissionBygroup,
    assignPermissionToGroup,
    getAllPermissions
};