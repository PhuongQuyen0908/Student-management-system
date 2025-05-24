import paramenterAPIService from '../service/paramenterAPIService.js';

const getAllParamenters = async (req, res) => {
    try {
        const response = await paramenterAPIService.getAllParamenter();
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in getAllParamenters:", error);
        return res.status(500).json({
            EM: "Lỗi server",
            EC: 1,
            DT: [],
        });
    }
}

const updateParamenter = async (req, res) => {
    try {
        const parameterKey = req.params.id;
        const data = req.body;
        const response = await paramenterAPIService.updateParamenter(parameterKey, data);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in updateParamenter:", error);
        return res.status(500).json({
            EM: "Lỗi server",
            EC: 1,
            DT: [],
        });
    }
}

module.exports = {
    getAllParamenters,
    updateParamenter,
};