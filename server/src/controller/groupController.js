
import groupApiService from "../service/groupAPIService";

const createFunc = async (req, res) => {
    try{
        let groupData = req.body;
        let data = await groupApiService.CreateGroup(groupData);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC, // error code
            DT: data.DT, // data
        });
    }catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Lỗi từ server", // error message
            EC: "-1", // error code
            DT: "", // data
        });
    }
}

const readFunc = async (req, res) => {
    try {
        let data = await groupApiService.GetAllGroups();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC, // error code
            DT: data.DT, // data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Lỗi từ server", // error message
            EC: "-1", // error code
            DT: "", // data
        });
    }
};

const getGroupsForAdmin = async (req, res) => {
    try {
        let data = await groupApiService.GetGroupsForAdmin();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC, // error code
            DT: data.DT, // data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Lỗi từ server", // error message
            EC: "-1", // error code
            DT: "", // data
        });
    }
}
module.exports = {
  createFunc,
  readFunc,
  getGroupsForAdmin

};