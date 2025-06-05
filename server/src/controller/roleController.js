import roleApiService from "../service/roleApiService";

const getRoleBygroup = async (req,res) =>{
  try {
    let MaNhom = req.params.groupId; // lấy MaNhom từ params
    let data = await roleApiService.getRoleByGroup(MaNhom);
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

const assignRoleToGroup = async(req,res)=>{
  try {
    let data = await roleApiService.assignRoleToGroup(req.body); // sau này sửa thành req.body.data
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
    getRoleBygroup,
    assignRoleToGroup
};