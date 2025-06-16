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
        if (data.GiaTri < 0){
            return buildResponse("Giá trị tham số không được nhỏ hơn 0", 1, null);
        }
        // Lấy tất cả tham số hiện tại
        const allParameters = await db.thamso.findAll();
        const paramsObj = {};
        allParameters.forEach(param => {
            paramsObj[param.TenThamSo] = param.GiaTri;
        });
        if (parameterKey === 'TuoiToiDa' && data.GiaTri < paramsObj['TuoiToiThieu']) {
            return buildResponse("Giá trị tuổi tối đa không được nhỏ hơn tuổi tối thiểu", 1, null);
        }
        if (parameterKey === 'TuoiToiThieu' && data.GiaTri > paramsObj['TuoiToiDa']) {
            return buildResponse("Giá trị tuổi tối thiểu không được lớn hơn tuổi tối đa", 1, null);
        }
        if (parameterKey === 'DiemToiDa' && data.GiaTri < paramsObj['DiemToiThieu']) {
            return buildResponse("Giá trị điểm tối đa không được nhỏ hơn điểm tối thiểu", 1, null);
        }
        if (parameterKey === 'DiemToiThieu' && data.GiaTri > paramsObj['DiemToiDa']) {
            return buildResponse("Giá trị điểm tối thiểu không được lớn hơn điểm tối đa", 1, null);
        }
        if (parameterKey === 'DiemDat' && (data.GiaTri < paramsObj['DiemToiThieu'] || data.GiaTri > paramsObj['DiemToiDa'])) {
            return buildResponse("Giá trị điểm đạt không hợp lệ. Điểm đạt phải nằm trong khoảng điểm tối thiểu và điểm tối đa", 1, null);
        }
        if (parameterKey === 'DiemQuaMon' && (data.GiaTri < paramsObj['DiemToiThieu'] || data.GiaTri > paramsObj['DiemToiDa'])) {
            return buildResponse("Giá trị điểm đạt môn không hợp lệ. Điểm đạt môn phải nằm trong khoảng điểm tối thiểu và điểm tối đa", 1, null);   
        }
        // const param = await db.thamso.findOne({ where: { TenThamSo: parameterKey } });
        // if (!param) {
        // return buildResponse('Không tìm thấy tham số', 1, null);
        // }
        // if (Number(param.GiaTri) === Number(value)) {
        // return buildResponse('Giá trị không thay đổi', 0, null); // hoặc vẫn trả về thành công
        // }
        const updated = await db.thamso.update(
            { GiaTri: data.GiaTri },
            { where: { TenThamSo: parameterKey } }
        );
        if (updated[0] === 0) {
            return buildResponse("Không có tham số nào được cập nhật", 1, null);
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
        console.log(">>>>>>>>>>>debug");
        console.error("Error updating parameter:", error);
        return buildResponse("Lỗi khi cập nhật tham số", 1, null);
    }
}

module.exports = {
    getAllParamenter,
    updateParamenter,
};