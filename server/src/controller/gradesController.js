import reportAPIService from '../service/reportAPIService.js';

const getOptions = async (req, res) => {
  try {
    const result = await reportAPIService.getOptions();

    // Trả về JSON đúng chuẩn
    return res.status(200).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT
    });
  } catch (error) {
    console.error('Error in getOptions controller:', error);
    return res.status(500).json({
      EM: 'Internal server error',
      EC: -1,
      DT: {}
    });
  }
};

const getSubjectSummary = async (req, res) => {
  try {
     const { tenLop, tenHocKy, tenNamHoc, tenMonHoc } = req.query;
     const summary = await reportAPIService.getSubjectSummary(tenLop, tenHocKy, tenNamHoc, tenMonHoc) 
     return res.status(200).json({
      EM: 'fetch ok',
      EC: 0, 
      DT: summary, 
    });
  } catch (error) {
    console.log("Lỗi getSubjectSummary:", error);
    return res.status(500).json({ 
      EM: 'error when getting subject summary',
      EC: -1, 
      DT: [], 
    });
  }
};


const addScore = async (req, res) => {
  try {
    const { HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP } = req.body;
    const new_bdchitietmonhoc = await reportAPIService.addScore(HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP);
    return res.status(200).json({
      EM: 'add score successfully!',
      EC: 0, 
      DT: new_bdchitietmonhoc, 
    });
  } catch (error) {
    console.log("error when adding score: ", error);
    return res.status(500).json({ 
      EM: 'error when adding score',
      EC: -1, 
      DT: [], 
    });
  }
}

const deleteScore = async (req, res) => {
  try {
    const { HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP } = req.body;
    const deleteScoreList = await reportAPIService.deleteScore(HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP);
    return res.status(200).json({
      EM: 'Xóa điểm thành công',
      EC: 0, 
      DT: deleteScoreList
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Lỗi server khi xoá điểm!" });
  }
};

const editScore = async (req, res) => {
  try {
    const { HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP } = req.body;
    const editScoreList = await reportAPIService.editScore(HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP);
    return res.status(200).json({
      EM: 'Chỉnh sửa điểm thành công',
      EC: 0, 
      DT: editScoreList
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Lỗi server khi chỉnh sửa điểm!" });
  }  
};


module.exports = {
  getSubjectSummary,
  addScore,
  deleteScore,
  editScore,
  getOptions,
};

