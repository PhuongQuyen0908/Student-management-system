import { sequelize } from '../config/connectDB.js';
import { Sequelize } from 'sequelize';

const Lop = require('../models/lop')(sequelize, Sequelize.DataTypes);
const HocKy = require('../models/hocky')(sequelize, Sequelize.DataTypes);
const NamHoc = require('../models/namhoc')(sequelize, Sequelize.DataTypes);
const MonHoc = require('../models/monhoc')(sequelize, Sequelize.DataTypes);


const getOptions = async (req, res) => {
  try {
    // Lấy tất cả các tên lớp, học kỳ, năm học, môn học từ 
    const lop = await Lop.findAll();
    const hocKy = await HocKy.findAll();
    const namHoc = await NamHoc.findAll();
    const monHoc = await MonHoc.findAll();

    res.status(200).json({
      lop: lop.map(item => ({ value: item.TenLop, label: item.TenLop })),
      hocKy: hocKy.map(item => ({ value: item.TenHocKy, label: item.TenHocKy })),
      namHoc: namHoc.map(item => ({ value: item.TenNamHoc, label: item.TenNamHoc })),
      monHoc: monHoc.map(item => ({ value: item.TenMonHoc, label: item.TenMonHoc })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi tải dữ liệu.' });
  }
};

module.exports = {
  getOptions,
};
