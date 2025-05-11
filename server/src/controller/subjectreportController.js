import reportAPIService from '../service/reportAPIService.js';

const tinhBaoCaoTongKetMon = async (req, res) => {
  const { tenMonHoc, tenHocKy, tenNamHoc } = req.body;

  const result = await reportAPIService.tinhBaoCaoTongKetMon(tenMonHoc, tenHocKy, tenNamHoc);

  return res.status(result.EC === 0 ? 200 : 400).json(result);
};

module.exports = {
  tinhBaoCaoTongKetMon
};