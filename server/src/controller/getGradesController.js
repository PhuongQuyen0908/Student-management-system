import { sequelize } from '../config/connectDB.js';
import { Sequelize } from 'sequelize';
const { Op } = require('sequelize');

const DanhSachLop = require('../models/danhsachlop.js')(sequelize, Sequelize.DataTypes);
const Lop = require('../models/lop.js')(sequelize, Sequelize.DataTypes);
const NamHoc = require('../models/namhoc.js')(sequelize, Sequelize.DataTypes);
const HocSinh = require('../models/hocsinh.js')(sequelize, Sequelize.DataTypes);
const CT_DSL = require('../models/ct_dsl.js')(sequelize, Sequelize.DataTypes);
const QuaTrinhHoc = require('../models/quatrinhhoc.js')(sequelize, Sequelize.DataTypes);
const HocKy = require('../models/hocky.js')(sequelize, Sequelize.DataTypes);
const BDMonHoc = require('../models/bdmonhoc.js')(sequelize, Sequelize.DataTypes);
const MonHoc = require('../models/monhoc.js')(sequelize, Sequelize.DataTypes);
const BDChiTietMonHoc = require('../models/bdchitietmonhoc.js')(sequelize, Sequelize.DataTypes);
const LoaiKiemTra = require('../models/loaikiemtra.js')(sequelize, Sequelize.DataTypes);

CT_DSL.belongsTo(HocSinh, { foreignKey: 'MaHocSinh' });
BDChiTietMonHoc.belongsTo(LoaiKiemTra, { foreignKey: 'MaLoaiKiemTra' });
//The Luan
const getSubjectSummary = async (req, res) => {
  try {
    const { tenLop, tenHocKy, tenNamHoc, tenMonHoc } = req.query;

    if (!tenLop || !tenHocKy || !tenNamHoc || !tenMonHoc) {
      return res.status(400).json({ error: "Thiếu tham số!" });
    }

    console.log(tenLop)

    const lop = await Lop.findOne({ where: { TenLop: tenLop } });
if (!lop) {
  return res.status(404).json({ error: "Không tìm thấy lớp!" });
}

const namHoc = await NamHoc.findOne({ where: { TenNamHoc: tenNamHoc } });
if (!namHoc) {
  return res.status(404).json({ error: "Không tìm thấy năm học!" });
}

const hocKy = await HocKy.findOne({ where: { TenHocKy: tenHocKy } });
if (!hocKy) {
  return res.status(404).json({ error: "Không tìm thấy học kỳ!" });
}

const monHoc = await MonHoc.findOne({ where: { TenMonHoc: tenMonHoc } });
if (!monHoc) {
  return res.status(404).json({ error: "Không tìm thấy môn học!" });
}
    const maHocKy = hocKy.MaHocKy;
    const maMonHoc = monHoc.MaMonHoc;
    if (!lop || !namHoc) {
      return res.status(404).json({ error: "Không tìm thấy lớp hoặc năm học!" });
    }
    console.log('Complete')

    console.log(lop)
    const danhSachLop = await DanhSachLop.findOne({
      where: {
        MaLop: lop.MaLop,
        MaNamHoc: namHoc.MaNamHoc,
      },
    });
    console.log('Complete')
    console.log(danhSachLop)

    if (!danhSachLop) {
      return res.status(404).json({ error: "Không tìm thấy danh sách lớp cho năm học này!" });
    }
    console.log('Complete')

    // 2. Tìm MaCT_DSL từ MaDanhSachLop
    const ctDsl = await CT_DSL.findAll({
      where: { MaDanhSachLop: danhSachLop.MaDanhSachLop },
      include: [
        {
          model: HocSinh,
          attributes: ['HoTen'], // Lấy tên học sinh
          required: true, // Đảm bảo chỉ lấy các bản ghi có học sinh liên quan
        },
      ],
    });

    console.log(ctDsl)


    

    if (!ctDsl) {
      return res.status(404).json({ error: "Không tìm thấy chi tiết danh sách lớp!" });
    }


    const quaTrinhHoc = await QuaTrinhHoc.findAll({
     where: {
       MaCT_DSL: { [Op.in]: ctDsl.map(item => item.MaCT_DSL) }, // Điều kiện tìm các CTDSL
       MaHocKy: maHocKy, // **Thay vì MaHocKy (ID), bây giờ sử dụng TenHocKy (Tên học kỳ)**
     },
   });


   console.log(quaTrinhHoc)

   if (!quaTrinhHoc || quaTrinhHoc.length === 0) {
     return res.status(404).json({ error: "Không tìm thấy quá trình học cho học sinh!" });
    }

    // 4. Tìm thông tin điểm BDMonHoc
    const bdMonHoc = await BDMonHoc.findOne({
      where: {
        MaQuaTrinhHoc: quaTrinhHoc[0].MaQuaTrinhHoc,
        MaMonHoc: maMonHoc, // Tên môn học
      },
    });

    

    if (!bdMonHoc) {
      return res.status(404).json({ error: "Không tìm thấy điểm môn học cho học sinh!" });
    }

    // 5. Lấy chi tiết điểm từ BDChiTietMonHoc
    const bdChiTiet = await BDChiTietMonHoc.findAll({
      where: {
        MaBDMonHoc: bdMonHoc.MaBDMonHoc,
      },
      include: [
        {
          model: LoaiKiemTra,
          attributes: ['TenLoaiKiemTra', 'HeSo'], // Lấy tên và hệ số loại kiểm tra
        },
      ],
    });

    console.log(bdChiTiet)

    if (!bdChiTiet) {
      return res.status(404).json({ error: "Không tìm thấy chi tiết điểm cho môn học!" });
    }

    // Tính điểm
    let totalScore = 0;
    let totalWeight = 0;
    bdChiTiet.forEach(item => {
      totalScore += item.Diem * item.LoaiKiemTra.HeSo;
      totalWeight += item.LoaiKiemTra.HeSo;
    });

    const diemTB = totalWeight > 0 ? (totalScore / totalWeight).toFixed(2) : "-";


    // 6. Trả kết quả
    return res.status(200).json({
      TenLop: tenLop,
      TenMonHoc: tenMonHoc,
      TenHocKy: tenHocKy,
      TenNamHoc: tenNamHoc,
      DiemChiTiet: ctDsl.map(item => ({
        HoTen: item.HocSinh?.HoTen || "Không xác định",
        DiemTB: diemTB,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Lỗi server!' });
  }
};
  
  module.exports = {
    getSubjectSummary,
  };
  