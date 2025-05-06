import { sequelize } from '../config/connectDB.js';
import { Sequelize } from 'sequelize';
const { Op } = require('sequelize');

// Import model
const DanhSachLop = require('../models/danhsachlop')(sequelize, Sequelize.DataTypes);
const Lop = require('../models/lop')(sequelize, Sequelize.DataTypes);
const NamHoc = require('../models/namhoc')(sequelize, Sequelize.DataTypes);
const HocKy = require('../models/hocky')(sequelize, Sequelize.DataTypes);
const CT_DSL = require('../models/ct_dsl')(sequelize, Sequelize.DataTypes);
const QuaTrinhHoc = require('../models/quatrinhhoc')(sequelize, Sequelize.DataTypes);
const HocSinh = require('../models/hocsinh')(sequelize, Sequelize.DataTypes);
const ThamSo = require('../models/thamso')(sequelize, Sequelize.DataTypes);

// Association (nếu chưa khai báo ở model)
DanhSachLop.belongsTo(Lop, { foreignKey: 'MaLop' });

const tinhBaoCaoTongKetHocKy = async (req, res) => {
  const { tenHocKy, tenNamHoc } = req.body;

  try {
    const namHoc = await NamHoc.findOne({ where: { TenNamHoc: tenNamHoc } });
    const hocKy = await HocKy.findOne({ where: { TenHocKy: tenHocKy } });
    const diemDatRecord = await ThamSo.findOne({ where: { TenThamSo: 'DiemDat' } });
    const diemDat = parseFloat(diemDatRecord?.GiaTri) || 5;

    if (!namHoc || !hocKy) {
      return res.status(404).json({ message: 'Không tìm thấy học kỳ hoặc năm học.' });
    }

    const danhSachLopList = await DanhSachLop.findAll({
      where: { MaNamHoc: namHoc.MaNamHoc },
      include: [{ model: Lop }]
    });

    const ketQua = [];

    for (const dsl of danhSachLopList) {
      const dsCT = await CT_DSL.findAll({ where: { MaDanhSachLop: dsl.MaDanhSachLop } });

      let soLuongDat = 0;

      for (const ct of dsCT) {
        const qt = await QuaTrinhHoc.findOne({
          where: {
            MaCT_DSL: ct.MaCT_DSL,
            MaHocKy: hocKy.MaHocKy
          }
        });

        const diemTBHK = qt?.DiemTBHocKy;

        if (diemTBHK !== null && diemTBHK !== undefined && diemTBHK >= diemDat) {
          soLuongDat++;
        }
      }

      const siSo = dsCT.length;
      const tiLe = siSo > 0 ? ((soLuongDat / siSo) * 100).toFixed(2) : '0.00';

      ketQua.push({
        stt: ketQua.length + 1,
        lop: dsl.lop?.TenLop || '[Không xác định]',
        siSo,
        soLuongDat,
        tiLe: `${tiLe}%`
      });
    }

    res.json({
      hocKy: tenHocKy,
      namHoc: tenNamHoc,
      diemDat,
      ketQua
    });

  } catch (err) {
    console.error('❌ Lỗi tính báo cáo học kỳ:', err);
    res.status(500).json({ message: 'Lỗi khi tính toán báo cáo.', error: err.message });
  }
};

export default {
  tinhBaoCaoTongKetHocKy
};
