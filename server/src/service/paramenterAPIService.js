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
       if(parameterKey ==="TuoiToiDa"){
            const TuoiToiThieu = await db.thamso.findOne({ where: { TenThamSo: "TuoiToiThieu" } });
            if (data.GiaTri < TuoiToiThieu.GiaTri) {
                return buildResponse("Tuổi tối đa không được nhỏ hơn tuổi tối thiểu", 1, null);
            }
        }
       
         if(parameterKey ==="TuoiToiThieu"){
                const TuoiToiDa = await db.thamso.findOne({ where: { TenThamSo: "TuoiToiDa" } });
                if (data.GiaTri > TuoiToiDa.GiaTri) {
                 return buildResponse("Tuổi tối thiểu không được lớn hơn tuổi tối đa", 1, null);
                }
          }
        if(parameterKey ==="DiemToiDa") {
            const DiemToiThieu = await db.thamso.findOne({ where: { TenThamSo: "DiemToiThieu" } });
            if (data.GiaTri < DiemToiThieu.GiaTri) {
                return buildResponse("Điểm tối đa không được nhỏ hơn điểm tối thiểu", 1, null);
            }
        }
         if(parameterKey === "DiemToiThieu") {
            const DiemToiDa = await db.thamso.findOne({ where: { TenThamSo: "DiemToiDa" } });
            if (data.GiaTri > DiemToiDa.GiaTri) {
                return buildResponse("Điểm tối thiểu không được lớn hơn điểm tối đa", 1, null);
            }
        }
        if(parameterKey ==="DiemDat"){
            const DiemToiDa = await db.thamso.findOne({ where: { TenThamSo: "DiemToiDa" } });
            const DiemToiThieu = await db.thamso.findOne({ where: { TenThamSo: "DiemToiThieu" } });
            if (data.GiaTri < DiemToiThieu.GiaTri || data.GiaTri > DiemToiDa.GiaTri) {
                return buildResponse("Điểm đạt phải nằm trong khoảng điểm tối thiểu và tối đa", 1, null);
            }
        }
        if(parameterKey ==="DiemQuaMon"){
            const DiemToiDa = await db.thamso.findOne({ where: { TenThamSo: "DiemToiDa" } });
            const DiemToiThieu = await db.thamso.findOne({ where: { TenThamSo: "DiemToiThieu" } });
            if (data.GiaTri < DiemToiThieu.GiaTri || data.GiaTri > DiemToiDa.GiaTri) {
                return buildResponse("Điểm qua môn phải nằm trong khoảng điểm tối thiểu và tối đa", 1, null);
            }
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