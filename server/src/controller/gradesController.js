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
    const { MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP } = req.body;
    const new_bdchitietmonhoc = await reportAPIService.addScore(MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP);
    return res.status(200).json({
      EM: 'Thêm điểm thành công',
      EC: 0, 
      DT: new_bdchitietmonhoc
    });
  } catch (error) {
    console.log("error when adding score: ", error);
    return res.status(500).json({ 
      EM: 'Lỗi khi thêm điểm',
      EC: -1, 
      DT: [] 
    });
  }
}

const deleteScore = async (req, res) => {
  try {
    const { MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP } = req.body;
    const deleteScoreList = await reportAPIService.deleteScore(MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP);
    return res.status(200).json({
      EM: 'Xóa điểm thành công',
      EC: 0, 
      DT: deleteScoreList
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      EM: "Lỗi server khi xoá điểm!",
      EC: -1,
      DT: []
    });
  }
};

const editScore = async (req, res) => {
  try {
    const { MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP } = req.body;
    const editScoreList = await reportAPIService.editScore(MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP);
    return res.status(200).json({
      EM: 'Chỉnh sửa điểm thành công',
      EC: 0, 
      DT: editScoreList
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      EM: "Lỗi server khi chỉnh sửa điểm!",
      EC: -1,
      DT: []
    });
  }  
};


module.exports = {
  getSubjectSummary,
  addScore,
  deleteScore,
  editScore,
  getOptions,
};
