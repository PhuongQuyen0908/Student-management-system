import reportAPIService from '../service/reportAPIService.js';

const tinhBaoCaoTongKetMon = async (req, res) => {
  try {
    const {
      tenMonHoc,
      tenHocKy,
      tenNamHoc,
      searchTerm = '',
      searchField = 'all',
      sortBy = null,
      order = 'asc'
    } = req.body;

    console.log('📥 search params:', { searchTerm, searchField });

    if (!tenMonHoc || !tenHocKy || !tenNamHoc) {
      return res.status(400).json({
        EM: 'Thiếu thông tin đầu vào (môn học, học kỳ hoặc năm học)',
        EC: 1,
        DT: {}
      });
    }


    const result = await reportAPIService.tinhBaoCaoTongKetMon(
      tenMonHoc,
      tenHocKy,
      tenNamHoc,
      searchTerm,
      searchField,
      sortBy,
      order
    );

    if (result.EC !== 0) {
      return res.status(400).json({
        EM: result.EM,
        EC: result.EC,
        DT: {}
      });
    }

    console.log("📌 Đang lọc theo:", { searchTerm, searchField });

    return res.status(200).json({
      EM: result.EM,
      EC: result.EC,
      DT: result.DT
    });

  } catch (err) {
    console.error('❌ Lỗi controller.tinhBaoCaoTongKetMon:', err);
    return res.status(500).json({
      EM: 'Đã xảy ra lỗi khi xử lý báo cáo tổng kết môn học',
      EC: -1,
      DT: {},
      error: err.message
    });
  }
};


export default {
  tinhBaoCaoTongKetMon
};
