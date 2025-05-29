import reportAPIService from '../service/reportAPIService.js';

const tinhBaoCaoTongKetHocKy = async (req, res) => {
  try {
    const { tenHocKy, tenNamHoc, searchTerm} = req.body;

    const result = await reportAPIService.tinhBaoCaoTongKetHocKy(tenHocKy, tenNamHoc);

    if (searchTerm && searchTerm.trim() !== '') {
      const ketQuaLoc = await reportAPIService.filterBySearchTerm(result.DT.ketQua, searchTerm);
      result.DT.ketQua = ketQuaLoc;
    }


    return res.status(200).json({
      EM: 'Tính báo cáo tổng kết học kỳ thành công',
      EC: 0,
      DT: result
    });
  } catch (err) {
    console.error('❌ Lỗi tính báo cáo học kỳ:', err);
    return res.status(500).json({
      EM: 'Lỗi khi tính toán báo cáo',
      EC: -1,
      DT: {},
      error: err.message 
    });
  }
};

module.exports = {
  tinhBaoCaoTongKetHocKy
};