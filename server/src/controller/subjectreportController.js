import { sequelize } from '../config/connectDB.js';
import { Sequelize } from 'sequelize';
const { Op } = require('sequelize');

const DanhSachLop = require('../models/danhsachlop')(sequelize, Sequelize.DataTypes);
const Lop = require('../models/lop')(sequelize, Sequelize.DataTypes);

DanhSachLop.belongsTo(Lop, { foreignKey: 'MaLop' });

const NamHoc = require('../models/namhoc')(sequelize, Sequelize.DataTypes);
const HocSinh = require('../models/hocsinh')(sequelize, Sequelize.DataTypes);
const CT_DSL = require('../models/ct_dsl')(sequelize, Sequelize.DataTypes);
const QuaTrinhHoc = require('../models/quatrinhhoc')(sequelize, Sequelize.DataTypes);
const HocKy = require('../models/hocky')(sequelize, Sequelize.DataTypes);
const BDMonHoc = require('../models/bdmonhoc')(sequelize, Sequelize.DataTypes);
const MonHoc = require('../models/monhoc')(sequelize, Sequelize.DataTypes);
const BDChiTietMonHoc = require('../models/bdchitietmonhoc')(sequelize, Sequelize.DataTypes);
const BCTKMonHoc = require('../models/bctk_monhoc')(sequelize, Sequelize.DataTypes);
const CTBCTKMon = require('../models/ctbctk_mon')(sequelize, Sequelize.DataTypes);
const ThamSo = require('../models/thamso')(sequelize, Sequelize.DataTypes);



const tinhBaoCaoTongKetMon = async (req, res) => {
  const { tenMonHoc, tenHocKy, tenNamHoc } = req.body;

  try {
    const namHoc = await NamHoc.findOne({ where: { TenNamHoc: tenNamHoc } });
    const hocKy = await HocKy.findOne({ where: { TenHocKy: tenHocKy } });
    const monHoc = await MonHoc.findOne({ where: { TenMonHoc: tenMonHoc } });

    if (!namHoc || !hocKy || !monHoc) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin nhập vào.' });
    }

    const danhSachLopList = await DanhSachLop.findAll({
      where: { MaNamHoc: namHoc.MaNamHoc },
      include: [{ model: Lop }]
    });

    console.log('==> Danh sách lớp:', JSON.stringify(danhSachLopList, null, 2));


    const ketQua = [];

    // Tạo bản ghi BCTK_MONHOC mới
    const baoCao = await BCTKMonHoc.create({
      MaNamHoc: namHoc.MaNamHoc,
      MaHocKy: hocKy.MaHocKy,
      MaMonHoc: monHoc.MaMonHoc
    });

    const thamSo = await ThamSo.findOne(); // giả sử chỉ có 1 dòng chứa DiemDat
    const diemDat = thamSo?.DiemDat || 5; // fallback nếu không có

    for (const dsl of danhSachLopList) {
      const dsCT = await CT_DSL.findAll({ where: { MaDanhSachLop: dsl.MaDanhSachLop } });

      let soLuongDat = 0;

      for (const ct of dsCT) {
        const qtHoc = await QuaTrinhHoc.findOne({
          where: {
            MaCT_DSL: ct.MaCT_DSL,
            MaHocKy: hocKy.MaHocKy
          }
        });

        if (!qtHoc) continue;

        const diemTBHocKy = qtHoc?.DiemTBHocKy || 0;

        const bdMon = await BDMonHoc.findOne({
          where: {
            MaQuaTrinhHoc: qtHoc?.MaQuaTrinhHoc,
            MaMonHoc: monHoc.MaMonHoc
            // ❌ Không có MaHocKy ở đây nữa
          }
        });

        if (!bdMon) continue;

        const diemMon = await BDChiTietMonHoc.findOne({
          where: { MaBDMonHoc: bdMon?.MaBDMonHoc }
        });

        const diemTPMonHoc = diemMon?.DiemTPMonHoc || 0;

        if (diemTPMonHoc >= diemDat && diemTBHocKy >= diemDat) {
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
        tiLe: tiLe + '%'
      });

      // Lưu CTBCTK_MON
      await CTBCTKMon.create({
        MaBCTKMonHoc: baoCao.MaBCTKMonHoc,
        MaDanhSachLop: dsl.MaDanhSachLop,
        SoLuongHS: siSo,
        SoLuongDat: soLuongDat,
        TiLe: tiLe
      });
    }

    res.json({
      monHoc: tenMonHoc,
      hocKy: tenHocKy,
      namHoc: tenNamHoc,
      ketQua
    });

  } catch (error) {
    console.error('❌ Lỗi chi tiết:', error);
    res.status(500).json({ message: 'Lỗi khi tính toán báo cáo.', error: error.message });
  }
};

export default { tinhBaoCaoTongKetMon };
