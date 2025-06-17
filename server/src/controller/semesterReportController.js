import reportAPIService from '../service/reportAPIService.js';

const tinhBaoCaoTongKetHocKy = async (req, res) => {
  try {
    const {
      tenHocKy,
      tenNamHoc,
      searchTerm = '',
      searchField = 'all',
      sortBy = null,
      order = 'asc'
    } = req.body;

    const result = await reportAPIService.tinhBaoCaoTongKetHocKy({
      tenHocKy,
      tenNamHoc,
      searchTerm,
      searchField,
      sortBy,
      order
    });

    if (result.EC !== 0) {
      return res.status(400).json({
        EM: result.EM,
        EC: result.EC,
        DT: {}
      });
    }

    return res.status(200).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT
    });

  } catch (err) {
    console.error('Lỗi tính báo cáo học kỳ:', err);
    return res.status(500).json({
      EM: 'Lỗi khi tính toán báo cáo',
      EC: -1,
      DT: {},
      error: err.message
    });
  }
};

export default {
  tinhBaoCaoTongKetHocKy
};
