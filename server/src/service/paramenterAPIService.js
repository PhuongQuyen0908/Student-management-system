import db from '../models/index.js';

const buildResponse = (EM, EC, DT) => ({ EM, EC, DT });

const getAllParamenter =  async() => {
    try {
        const parameters = await db.thamso.findAll();
        if(parameters.length === 0) {
            return buildResponse("Không có tham số nào", 1, []);
        }
        else {
            return buildResponse("Lấy danh sách tham số thành công", 0, parameters);
        }
    } catch (error) {
        console.error("Error fetching parameters:", error);
        return buildResponse("Lỗi khi lấy danh sách tham số", 1, []);
    }
}

const updateParamenter = async (parameterKey, data) => {
    try {
        const parameter = await db.thamso.findOne({ where: { TenThamSo: parameterKey } });
        if (!parameter) {
            return buildResponse("Tham số không tồn tại", 1, null);
        }
        await db.thamso.update(data, { where: { TenThamSo: parameterKey } });
        return buildResponse("Cập nhật tham số thành công", 0, null);
    } catch (error) {
        console.error("Error updating parameter:", error);
        return buildResponse("Lỗi khi cập nhật tham số", 1, null);
    }
}

module.exports = {
    getAllParamenter,
    updateParamenter,
};