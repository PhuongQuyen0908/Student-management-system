const sortSubjectReportService = require('../service/sortSubjectReportAPIService.js');

const sortSubjectReport = async (req, res) => {
  const { data, sortBy, order } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ EC: 1, EM: 'Dữ liệu không hợp lệ', DT: [] });
  }

  const sorted = sortSubjectReportService(data, sortBy, order);

  return res.status(200).json({
    EC: 0,
    EM: 'Sắp xếp thành công',
    DT: sorted,
  });
};

module.exports = {
  sortSubjectReport,
};
