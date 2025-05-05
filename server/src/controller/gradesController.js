import { sequelize } from '../config/connectDB.js';
import { Sequelize } from 'sequelize';
const { Op } = require('sequelize');

const DanhSachLop = require('../models/danhsachlop')(sequelize, Sequelize.DataTypes);
const Lop = require('../models/lop')(sequelize, Sequelize.DataTypes);
const NamHoc = require('../models/namhoc')(sequelize, Sequelize.DataTypes);
const HocSinh = require('../models/hocsinh')(sequelize, Sequelize.DataTypes);
const CT_DSL = require('../models/ct_dsl')(sequelize, Sequelize.DataTypes);
const QuaTrinhHoc = require('../models/quatrinhhoc')(sequelize, Sequelize.DataTypes);
const HocKy = require('../models/hocky')(sequelize, Sequelize.DataTypes);
const BDMonHoc = require('../models/bdmonhoc')(sequelize, Sequelize.DataTypes);
const MonHoc = require('../models/monhoc')(sequelize, Sequelize.DataTypes);
const BDChiTietMonHoc = require('../models/bdchitietmonhoc')(sequelize, Sequelize.DataTypes);
const LoaiKiemTra = require('../models/loaikiemtra')(sequelize, Sequelize.DataTypes);
const ThamSo = require('../models/thamso')(sequelize, Sequelize.DataTypes);



CT_DSL.belongsTo(HocSinh, { foreignKey: 'MaHocSinh' });
BDChiTietMonHoc.belongsTo(LoaiKiemTra, { foreignKey: 'MaLoaiKiemTra' });

async function getThamSo(tenThamSo) {
  const param = await ThamSo.findOne({ where: { TenThamSo: tenThamSo } });
  return param ? param.GiaTri : null;
}

const calculateAndUpdateDiemTB = async (MaBDMonHoc) => {
  const bdChiTietList = await BDChiTietMonHoc.findAll({
    where: { MaBDMonHoc },
    include: [{
      model: LoaiKiemTra,
      attributes: ['HeSo'],
    }]
  });

  let total = 0;
  let weight = 0;

  bdChiTietList.forEach(item => {
    const diem = parseFloat(item.DiemTPMonHoc);
    const heso = item.loaikiemtra?.HeSo || 1;

    if (!isNaN(diem)) {
      total += diem * heso;
      weight += heso;
    }
  });

  const diemTB = weight ? (total / weight).toFixed(2) : null;

  await BDMonHoc.update(
    { DiemTBMonHoc: diemTB },
    { where: { MaBDMonHoc } }
  );
};

const getSubjectSummary = async (req, res) => {
  try {
    const { tenLop, tenHocKy, tenNamHoc, tenMonHoc } = req.query;

    if (!tenLop || !tenHocKy || !tenNamHoc || !tenMonHoc) {
      return res.status(400).json({ error: "Thiếu tham số!" });
    }

    const lop = await Lop.findOne({ where: { TenLop: tenLop } });
    const namHoc = await NamHoc.findOne({ where: { TenNamHoc: tenNamHoc } });
    const hocKy = await HocKy.findOne({ where: { TenHocKy: tenHocKy } });
    const monHoc = await MonHoc.findOne({ where: { TenMonHoc: tenMonHoc } });

    if (!lop || !namHoc || !hocKy || !monHoc) {
      return res.status(404).json({ error: "Không tìm thấy thông tin lớp/năm học/học kỳ/môn học!" });
    }

    const danhSachLop = await DanhSachLop.findOne({
      where: {
        MaLop: lop.MaLop,
        MaNamHoc: namHoc.MaNamHoc,
      },
    });

    if (!danhSachLop) {
      return res.status(404).json({ error: "Không tìm thấy danh sách lớp!" });
    }

    const ctDsl = await CT_DSL.findAll({
      where: { MaDanhSachLop: danhSachLop.MaDanhSachLop },
      include: [
        {
          model: HocSinh,
          attributes: ['HoTen'],
          required: true, // Đảm bảo JOIN bắt buộc có học sinh
        },
      ],
    });

    const maCTs = ctDsl.map(item => item.MaCT_DSL);

    const quaTrinhHocList = await QuaTrinhHoc.findAll({
      where: {
        MaCT_DSL: { [Op.in]: maCTs },
        MaHocKy: hocKy.MaHocKy
      }
    });

    const maQTHs = quaTrinhHocList.map(qth => qth.MaQuaTrinhHoc);

    const bdMonHocList = await BDMonHoc.findAll({
      where: {
        MaQuaTrinhHoc: { [Op.in]: maQTHs },
        MaMonHoc: monHoc.MaMonHoc
      }
    });

    const maBDs = bdMonHocList.map(bd => bd.MaBDMonHoc);

    const bdChiTietList = await BDChiTietMonHoc.findAll({
      where: {
        MaBDMonHoc: { [Op.in]: maBDs }
      },
      include: [
        {
          model: LoaiKiemTra,
          as: 'loaikiemtra',
          attributes: ['TenLoaiKiemTra', 'HeSo']
        }
      ]
    });

    // Mapping data
    const data = ctDsl.map(ct => {
      const hocSinh = ct.hocsinh?.HoTen || "Không xác định";

      const qth = quaTrinhHocList.find(q => q.MaCT_DSL === ct.MaCT_DSL);
  const bdMonHoc = qth
    ? bdMonHocList.find(bd => bd.MaQuaTrinhHoc === qth.MaQuaTrinhHoc)
    : null;

  const diemTP = bdMonHoc
    ? bdChiTietList
        .filter(bd => bd.MaBDMonHoc === bdMonHoc.MaBDMonHoc)
        .map(bd => ({
          LoaiKiemTra: bd.loaikiemtra?.TenLoaiKiemTra || "Không rõ",
          Diem: bd.DiemTPMonHoc,
          HeSo: bd.loaikiemtra?.HeSo || 1
        }))
    : [];

  
  const diemTB = bdMonHoc?.DiemTBMonHoc || "-";

  return {
    HoTen: hocSinh,
    DiemTP: diemTP,
    DiemTB: diemTB
  };
});

    return res.status(200).json({
      TenLop: tenLop,
      TenMonHoc: tenMonHoc,
      TenHocKy: tenHocKy,
      TenNamHoc: tenNamHoc,
      DiemChiTiet: data
    });

  } catch (error) {
    console.error("Lỗi getSubjectSummary:", error);
    return res.status(500).json({ error: "Lỗi server!" });
  }
};

const addScore = async (req, res) => {
  try {
    const { HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP } = req.body;

    // Tìm các entity liên quan
    const lop = await Lop.findOne({ where: { TenLop } });
    const monHoc = await MonHoc.findOne({ where: { TenMonHoc } });
    const hocKy = await HocKy.findOne({ where: { TenHocKy } });
    const namHoc = await NamHoc.findOne({ where: { TenNamHoc } });
    const hocSinh = await HocSinh.findOne({ where: { HoTen } });

    if (!lop || !monHoc || !hocKy || !namHoc || !hocSinh) {
      return res.status(400).json({ error: "Thông tin không hợp lệ" });
    }

    const minScore = await getThamSo("DiemToiThieu");
    const maxScore = await getThamSo("DiemToiDa");

    for (const d of DiemTP) {
      const diemSo = parseFloat(d.Diem);
      if (isNaN(diemSo) || diemSo < minScore || diemSo > maxScore) {
        return res.status(400).json({
          error: `Điểm ${diemSo} không hợp lệ. Phải nằm trong khoảng từ ${minScore} đến ${maxScore}.`
        });
      }
    }

    const dsl = await DanhSachLop.findOne({ where: { MaLop: lop.MaLop, MaNamHoc: namHoc.MaNamHoc } });
    const ct = await CT_DSL.findOne({ where: { MaDanhSachLop: dsl.MaDanhSachLop, MaHocSinh: hocSinh.MaHocSinh } });

    let qth = await QuaTrinhHoc.findOne({ where: { MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy } });
    if (!qth) qth = await QuaTrinhHoc.create({ MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy });

    let bd = await BDMonHoc.findOne({ where: { MaQuaTrinhHoc: qth.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc } });
    if (!bd) bd = await BDMonHoc.create({ MaQuaTrinhHoc: qth.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc });

    
    for (const item of DiemTP) {
      const loai = await LoaiKiemTra.findOne({ where: { TenLoaiKiemTra: item.LoaiKiemTra } });
      if (!loai) continue;

      await BDChiTietMonHoc.create({
        MaBDMonHoc: bd.MaBDMonHoc,
        MaLoaiKiemTra: loai.MaLoaiKiemTra,
        DiemTPMonHoc: item.Diem,
      });
    }

    await calculateAndUpdateDiemTB(bd.MaBDMonHoc);

    return res.status(200).json({ message: "Thêm điểm thành công!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Lỗi server khi thêm điểm!" });
  }
};

const deleteScore = async (req, res) => {
  try {
    const { HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP } = req.body;

    const lop = await Lop.findOne({ where: { TenLop } });
    const monHoc = await MonHoc.findOne({ where: { TenMonHoc } });
    const hocKy = await HocKy.findOne({ where: { TenHocKy } });
    const namHoc = await NamHoc.findOne({ where: { TenNamHoc } });
    const hocSinh = await HocSinh.findOne({ where: { HoTen } });

    if (!lop || !monHoc || !hocKy || !namHoc || !hocSinh) {
      return res.status(400).json({ error: "Thông tin không hợp lệ" });
    }

    const dsl = await DanhSachLop.findOne({ where: { MaLop: lop.MaLop, MaNamHoc: namHoc.MaNamHoc } });
    const ct = await CT_DSL.findOne({ where: { MaDanhSachLop: dsl.MaDanhSachLop, MaHocSinh: hocSinh.MaHocSinh } });
    const qth = await QuaTrinhHoc.findOne({ where: { MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy } });
    const bd = await BDMonHoc.findOne({ where: { MaQuaTrinhHoc: qth.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc } });

    for (const item of DiemTP) {
      const loai = await LoaiKiemTra.findOne({ where: { TenLoaiKiemTra: item.LoaiKiemTra } });
      if (!loai) continue;

      await BDChiTietMonHoc.destroy({
        where: {
          MaBDMonHoc: bd.MaBDMonHoc,
          MaLoaiKiemTra: loai.MaLoaiKiemTra,
          DiemTPMonHoc: item.Diem,
        },
      });
    }

    await calculateAndUpdateDiemTB(bd.MaBDMonHoc);

    return res.status(200).json({ message: "Xoá điểm thành công!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Lỗi server khi xoá điểm!" });
  }
};

const editScore = async (req, res) => {
  try {
    const { HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP } = req.body;

    const lop = await Lop.findOne({ where: { TenLop } });
    const monHoc = await MonHoc.findOne({ where: { TenMonHoc } });
    const hocKy = await HocKy.findOne({ where: { TenHocKy } });
    const namHoc = await NamHoc.findOne({ where: { TenNamHoc } });
    const hocSinh = await HocSinh.findOne({ where: { HoTen } });

    if (!lop || !monHoc || !hocKy || !namHoc || !hocSinh) {
      return res.status(400).json({ error: "Thông tin không hợp lệ" });
    }

    const minScore = await getThamSo("DiemToiThieu");
    const maxScore = await getThamSo("DiemToiDa");

    for (const d of DiemTP) {
      const diemSo = parseFloat(d.Diemmoi ?? d.Diem);
      if (isNaN(diemSo) || diemSo < minScore || diemSo > maxScore) {
        return res.status(400).json({
          error: `Điểm ${diemSo} không hợp lệ. Phải nằm trong khoảng từ ${minScore} đến ${maxScore}.`
        });
      }
    }

    const dsl = await DanhSachLop.findOne({ where: { MaLop: lop.MaLop, MaNamHoc: namHoc.MaNamHoc } });
    const ct = await CT_DSL.findOne({ where: { MaDanhSachLop: dsl.MaDanhSachLop, MaHocSinh: hocSinh.MaHocSinh } });
    const qth = await QuaTrinhHoc.findOne({ where: { MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy } });
    const bd = await BDMonHoc.findOne({ where: { MaQuaTrinhHoc: qth.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc } });

    for (const item of DiemTP) {
      const loai = await LoaiKiemTra.findOne({ where: { TenLoaiKiemTra: item.LoaiKiemTra } });
      if (!loai) continue;

      await BDChiTietMonHoc.update(
        { DiemTPMonHoc: item.Diemmoi },
        {
          where: {
            MaBDMonHoc: bd.MaBDMonHoc,
            MaLoaiKiemTra: loai.MaLoaiKiemTra,
            DiemTPMonHoc: item.Diem, // Chỉ sửa đúng điểm cần sửa
          },
        }
      );
    }

    await calculateAndUpdateDiemTB(bd.MaBDMonHoc);

    return res.status(200).json({ message: "Chỉnh sửa điểm thành công!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Lỗi server khi chỉnh sửa điểm!" });
  }
};


module.exports = {
  getSubjectSummary,
  addScore,
  deleteScore,
  editScore,
  calculateAndUpdateDiemTB,
  getThamSo,
};

