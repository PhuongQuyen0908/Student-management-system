import db from "../models/index.js";
const { Op } = db.Sequelize;
const { hocsinh, ct_dsl, bdchitietmonhoc, loaikiemtra, danhsachlop, lop, bdmonhoc, monhoc } = db;

ct_dsl.belongsTo(hocsinh, { foreignKey: 'MaHocSinh' });
bdchitietmonhoc.belongsTo(loaikiemtra, { foreignKey: 'MaLoaiKiemTra' });
danhsachlop.belongsTo(lop, { foreignKey: 'MaLop' });
bdmonhoc.belongsTo(monhoc, { foreignKey: 'MaMonHoc' });

async function getThamSo(tenThamSo) {
  const param = await db.thamso.findOne({ where: { TenThamSo: tenThamSo } });
  return param ? param.GiaTri : null;
}

const getOptions = async () => {
  try {
    const [lopRaw, namHocRaw, hocKyRaw, monHocRaw] = await Promise.all([
      db.lop.findAll(),
      db.namhoc.findAll(),
      db.hocky.findAll(),
      db.monhoc.findAll(),
    ]);

    const lop = lopRaw.map(obj => obj.get({ plain: true }));
    const namHoc = namHocRaw.map(obj => obj.get({ plain: true }));
    const hocKy = hocKyRaw.map(obj => obj.get({ plain: true }));
    const monHoc = monHocRaw.map(obj => obj.get({ plain: true }));

    const data = {
      lop: lop.map(item => ({ value: item.TenLop, label: item.TenLop })),
      hocKy: hocKy.map(item => ({ value: item.TenHocKy, label: item.TenHocKy })),
      namHoc: namHoc.map(item => ({ value: item.TenNamHoc, label: item.TenNamHoc })),
      monHoc: monHoc.map(item => ({ value: item.TenMonHoc, label: item.TenMonHoc })),
    };

    return {
      EM: 'getOptions OK',
      EC: 0,
      DT: JSON.parse(JSON.stringify(data))
    };
  } catch (error) {
    console.error('Error in getOptions service:', error);
    return {
      EM: 'Error from service',
      EC: -1,
      DT: {}
    };
  }
};

const calculateAndUpdateDiemTB = async (MaBDMonHoc) => {
  const bdChiTietList = await bdchitietmonhoc.findAll({
    where: { MaBDMonHoc },
    include: [{
      model: loaikiemtra,
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
  console.log(total);
  console.log(weight);
  const diemTB = weight ? parseFloat((total / weight).toFixed(2)) : null;

  await db.bdmonhoc.update(
    { DiemTBMonHoc: diemTB },
    { where: { MaBDMonHoc } }
  );

  return diemTB;
};
 
const getSubjectSummary = async (tenLop, tenHocKy, tenNamHoc, tenMonHoc) => {
  try {

    if (!tenLop || !tenHocKy || !tenNamHoc || !tenMonHoc) {
      return { EM: 'Thông tin nhập không đầy đủ', EC: -1, DT: null };
    }

    const lop = await db.lop.findOne({ where: { TenLop: tenLop } });
    const namHoc = await db.namhoc.findOne({ where: { TenNamHoc: tenNamHoc } });
    const hocKy = await db.hocky.findOne({ where: { TenHocKy: tenHocKy } });
    const monHoc = await db.monhoc.findOne({ where: { TenMonHoc: tenMonHoc } });
    
    console.log(lop);
    if (!lop || !namHoc || !hocKy || !monHoc) {
      return { EM: 'Không tìm thấy thông tin', EC: -1, DT: null };
    }

    const danhSachLop = await db.danhsachlop.findOne({
      where: {
        MaLop: lop.MaLop,
        MaNamHoc: namHoc.MaNamHoc,
      },
    });

    if (!danhSachLop) {
      return { EM: 'Không tìm thấy lớp', EC: -1, DT: null };
    }

    const ctDsl = await db.ct_dsl.findAll({
      where: { MaDanhSachLop: danhSachLop.MaDanhSachLop },
      include: [
        {
          model: db.hocsinh,
          attributes: ['HoTen'],
          required: true, 
        },
      ],
    });

    const maCTs = ctDsl.map(item => item.MaCT_DSL);

    const quaTrinhHocList = await db.quatrinhhoc.findAll({
      where: {
        MaCT_DSL: { [Op.in]: maCTs },
        MaHocKy: hocKy.MaHocKy
      }
    });

    const maQTHs = quaTrinhHocList.map(qth => qth.MaQuaTrinhHoc);

    const bdMonHocList = await db.bdmonhoc.findAll({
      where: {
        MaQuaTrinhHoc: { [Op.in]: maQTHs },
        MaMonHoc: monHoc.MaMonHoc
      }
    });

    const maBDs = bdMonHocList.map(bd => bd.MaBDMonHoc);

    const bdChiTietList = await db.bdchitietmonhoc.findAll({
      where: {
        MaBDMonHoc: { [Op.in]: maBDs }
      },
      include: [
        {
          model: db.loaikiemtra,
          attributes: ['TenLoaiKiemTra', 'HeSo']
        }
      ]
    });

    const data = await Promise.all(ctDsl.map(async (ct) => {
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
    
      const diemTB = bdMonHoc
        ? await calculateAndUpdateDiemTB(bdMonHoc.MaBDMonHoc)
        : null;
    
      return {
        HoTen: hocSinh,
        DiemTP: diemTP,
        DiemTB: diemTB
      };
    }));
    

  const summary = {
    TenLop: tenLop,
    TenMonHoc: tenMonHoc,
    TenHocKy: tenHocKy,
    TenNamHoc: tenNamHoc,
    DiemChiTiet: data
  };

  return {
    EM: 'OK',
    EC: 0,
    DT: summary
  };

} catch (error) {
  console.error("Lỗi getSubjectSummary: ", error);
  return {
    EM: 'Lỗi khi truy vấn',
    EC: -1,
    DT: null
  };
}
};

const addScore = async (HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP) => {
  try {
    const lop = await db.lop.findOne({ where: { TenLop } });
    const monHoc = await db.monhoc.findOne({ where: { TenMonHoc } });
    const hocKy = await db.hocky.findOne({ where: { TenHocKy } });
    const namHoc = await db.namhoc.findOne({ where: { TenNamHoc } });
    const hocSinh = await db.hocsinh.findOne({ where: { HoTen } });

    if (!lop || !monHoc || !hocKy || !namHoc || !hocSinh) {
      return { EM: 'Không tìm thấy thông tin học sinh', EC: -1, DT: null };
    }

    const minScore = await getThamSo("DiemToiThieu");
    const maxScore = await getThamSo("DiemToiDa");

    for (const d of DiemTP) {
      const diemSo = parseFloat(d.Diem);
      if (isNaN(diemSo) || diemSo < minScore || diemSo > maxScore) {
        return { EM: 'Điểm ${diemSo} không hợp lệ. Phải nằm trong khoảng từ ${minScore} đến ${maxScore}.', EC: -1, DT: null }
      }
    }

    const dsl = await db.danhsachlop.findOne({ where: { MaLop: lop.MaLop, MaNamHoc: namHoc.MaNamHoc } });
    const ct = await db.ct_dsl.findOne({ where: { MaDanhSachLop: dsl.MaDanhSachLop, MaHocSinh: hocSinh.MaHocSinh } });

    let qth = await db.quatrinhhoc.findOne({ where: { MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy } });
    if (!qth) qth = await db.quatrinhhoc.create({ MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy });

    let bd = await db.bdmonhoc.findOne({ where: { MaQuaTrinhHoc: qth.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc } });
    if (!bd) bd = await db.bdmonhoc.create({ MaQuaTrinhHoc: qth.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc });

    const createdChiTietList = [];

    for (const item of DiemTP) {
      const loai = await db.loaikiemtra.findOne({ where: { TenLoaiKiemTra: item.LoaiKiemTra } });
      if (!loai) continue;

    const new_bdchitietmonhoc = await db.bdchitietmonhoc.create({
        MaBDMonHoc: bd.MaBDMonHoc,
        MaLoaiKiemTra: loai.MaLoaiKiemTra,
        DiemTPMonHoc: item.Diem,
      });
    createdChiTietList.push(new_bdchitietmonhoc);
    }

    await calculateAndUpdateDiemTB(bd.MaBDMonHoc);

    return {
      EM: 'Thêm điểm thành công',
      EC: 0,
      DT: createdChiTietList
    };
  }
    catch (error) {
      console.error("Lỗi thêm điểm: ", error);
      return {
        EM: 'Lỗi khi thêm điểm',
        EC: -1,
        DT: []
      };
    };
  }

const deleteScore = async (HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP) => {
  try {
    const lop = await db.lop.findOne({ where: { TenLop } });
    const monHoc = await db.monhoc.findOne({ where: { TenMonHoc } });
    const hocKy = await db.hocky.findOne({ where: { TenHocKy } });
    const namHoc = await db.namhoc.findOne({ where: { TenNamHoc } });
    const hocSinh = await db.hocsinh.findOne({ where: { HoTen } });

    if (!lop || !monHoc || !hocKy || !namHoc || !hocSinh) {
      return { EM: 'Không tìm thấy thông tin', EC: -1, DT: null };
    }

    const dsl = await db.danhsachlop.findOne({ where: { MaLop: lop.MaLop, MaNamHoc: namHoc.MaNamHoc } });
    const ct = await db.ct_dsl.findOne({ where: { MaDanhSachLop: dsl.MaDanhSachLop, MaHocSinh: hocSinh.MaHocSinh } });
    const qth = await db.quatrinhhoc.findOne({ where: { MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy } });
    const bd = await db.bdmonhoc.findOne({ where: { MaQuaTrinhHoc: qth.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc } });

    const destroyScoreList = []
    for (const item of DiemTP) {
      const loai = await db.loaikiemtra.findOne({ where: { TenLoaiKiemTra: item.LoaiKiemTra } });
      if (!loai) continue;

      const deleted = await db.bdchitietmonhoc.destroy({
        where: {
          MaBDMonHoc: bd.MaBDMonHoc,
          MaLoaiKiemTra: loai.MaLoaiKiemTra,
          //DiemTPMonHoc: item.Diem,
        },
      });

      destroyScoreList.push(deleted);
    }

    await calculateAndUpdateDiemTB(bd.MaBDMonHoc);

    return {
      EM: 'Xóa điểm thành công',
      EC: 0,
      DT: destroyScoreList
    };
  }
    catch (error) {
      console.error("Lỗi xóa điểm: ", error);
      return {
        EM: 'Lỗi khi xóa điểm',
        EC: -1,
        DT: []
      };
    };

  }

const editScore = async (HoTen, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP) => {
  try {
    const lop = await db.lop.findOne({ where: { TenLop } });
    const monHoc = await db.monhoc.findOne({ where: { TenMonHoc } });
    const hocKy = await db.hocky.findOne({ where: { TenHocKy } });
    const namHoc = await db.namhoc.findOne({ where: { TenNamHoc } });
    const hocSinh = await db.hocsinh.findOne({ where: { HoTen } });

    if (!lop || !monHoc || !hocKy || !namHoc || !hocSinh) {
      return { EM: 'Không tìm thấy thông tin', EC: -1, DT: null };

    }

    const minScore = await getThamSo("DiemToiThieu");
    const maxScore = await getThamSo("DiemToiDa");

    for (const d of DiemTP) {
      const diemSo = parseFloat(d.Diemmoi ?? d.Diem);
      if (isNaN(diemSo) || diemSo < minScore || diemSo > maxScore) {
        return { EM: 'Điểm ${diemSo} không hợp lệ. Phải nằm trong khoảng từ ${minScore} đến ${maxScore}.', EC: -1, DT: null };
      }
    }

    const dsl = await db.danhsachlop.findOne({ where: { MaLop: lop.MaLop, MaNamHoc: namHoc.MaNamHoc } });
    const ct = await db.ct_dsl.findOne({ where: { MaDanhSachLop: dsl.MaDanhSachLop, MaHocSinh: hocSinh.MaHocSinh } });
    const qth = await db.quatrinhhoc.findOne({ where: { MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy } });
    const bd = await db.bdmonhoc.findOne({ where: { MaQuaTrinhHoc: qth.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc } });

    const editScoreList = []
    for (const item of DiemTP) {
      const loai = await db.loaikiemtra.findOne({ where: { TenLoaiKiemTra: item.LoaiKiemTra } });
      if (!loai) continue;

      const updatedScore = await db.bdchitietmonhoc.update(
        { DiemTPMonHoc: item.Diemmoi },
        {
          where: {
            MaBDMonHoc: bd.MaBDMonHoc,
            MaLoaiKiemTra: loai.MaLoaiKiemTra,
            //DiemTPMonHoc: item.Diem,
          },
        }
      );

      editScoreList.push(updatedScore);
    }

    await calculateAndUpdateDiemTB(bd.MaBDMonHoc);

    return {
      EM: 'Chỉnh sửa điểm thành công',
      EC: 0,
      DT: editScoreList
    };
  }
    catch (error) {
      console.error("Lỗi chỉnh sửa điểm: ", error);
      return {
        EM: 'Lỗi khi chỉnh sửa điểm',
        EC: -1,
        DT: []
      };
    };
};

const tinhDiemTBHocKy = async (maQuaTrinhHoc) => {
  try {
    const dsBDMon = await db.bdmonhoc.findAll({
      where: { MaQuaTrinhHoc: maQuaTrinhHoc },
      include: [{
        model: db.monhoc,
        attributes: ['HeSo']
      }]
    });

    let tongDiem = 0;
    let tongHeSo = 0;

    for (const bdMon of dsBDMon) {
      const diemTBMonHoc = bdMon?.DiemTBMonHoc || 0;
      const heSo = bdMon.monhoc?.HeSo || 1;

      tongDiem += diemTBMonHoc * heSo;
      tongHeSo += heSo;
    }

    const diemTBHocKy = tongHeSo > 0 ? tongDiem / tongHeSo : 0;

    // Cập nhật xuống DB nếu cần
    await db.quatrinhhoc.update(
      { DiemTBHocKy: diemTBHocKy },
      { where: { MaQuaTrinhHoc: maQuaTrinhHoc } }
    );

    return diemTBHocKy;
  } catch (error) {
    console.error(`Lỗi tính điểm TB học kỳ cho MaQuaTrinhHoc=${maQuaTrinhHoc}:`, error);
    return 0;
  }
};


const tinhBaoCaoTongKetHocKy = async (tenHocKy, tenNamHoc) => {
  try {
    const namHoc = await db.namhoc.findOne({ where: { TenNamHoc: tenNamHoc } });
    const hocKy = await db.hocky.findOne({ where: { TenHocKy: tenHocKy } });
    const diemDatRecord = await db.thamso.findOne({ where: { TenThamSo: 'DiemDat' } });
    const diemDat = parseFloat(diemDatRecord?.GiaTri) || 5;

    if (!namHoc || !hocKy) {
      return {
        EM: 'Không tìm thấy học kỳ hoặc năm học.',
        EC: -1,
        DT: {}
      };
    }

    const danhSachLopList = await db.danhsachlop.findAll({
      where: { MaNamHoc: namHoc.MaNamHoc },
      include: [{ model: db.lop }]
    });

    const ketQua = [];

    for (const dsl of danhSachLopList) {
      const dsCT = await db.ct_dsl.findAll({ where: { MaDanhSachLop: dsl.MaDanhSachLop } });
      let soLuongDat = 0;

      for (const ct of dsCT) {
        const qt = await db.quatrinhhoc.findOne({
          where: {
            MaCT_DSL: ct.MaCT_DSL,
            MaHocKy: hocKy.MaHocKy
          }
        });

        if (!qt) continue;

        // ✅ Tính và cập nhật điểm trung bình từng môn học trước
        const bdMonList = await db.bdmonhoc.findAll({
          where: { MaQuaTrinhHoc: qt.MaQuaTrinhHoc }
        });

        for (const bd of bdMonList) {
          await calculateAndUpdateDiemTB(bd.MaBDMonHoc);
        }

        const diemTBHK = await tinhDiemTBHocKy(qt.MaQuaTrinhHoc);
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

    return {
      EM: 'Tính báo cáo thành công',
      EC: 0,
      DT: {
        hocKy: tenHocKy,
        namHoc: tenNamHoc,
        diemDat,
        ketQua
      }
    };
  } catch (error) {
    console.error('Service Error:', error);
    return {
      EM: 'Lỗi khi tính toán báo cáo',
      EC: -1,
      DT: {},
    };
  }
};

const tinhDiemTBMonHoc = async (maBDMonHoc) => {
  try {
    const dsDiem = await db.bdchitietmonhoc.findAll({
      where: { MaBDMonHoc: maBDMonHoc },
      include: [{
        model: db.loaikiemtra,
        attributes: ['HeSo']
      }]
    });

    let tongDiem = 0;
    let tongHeSo = 0;

    for (const ct of dsDiem) {
      const diem = ct.Diem || 0;
      const heSo = ct.loaikiemtra?.HeSo || 1; // mặc định HeSo = 1 nếu thiếu

      tongDiem += diem * heSo;
      tongHeSo += heSo;
    }

    const diemTB = tongHeSo > 0 ? (tongDiem / tongHeSo) : 0;

    console.log(diemTB)
    // Lưu vào BDMonHoc nếu muốn cập nhật kết quả
    await db.bdmonhoc.update(
      { DiemTBMonHoc: diemTB },
      { where: { MaBDMonHoc: maBDMonHoc } }
    );

    return diemTB;
  } catch (error) {
    console.error(`Lỗi khi tính DiemTBMonHoc cho MaBDMonHoc=${maBDMonHoc}:`, error);
    return 0;
  }
};

const tinhBaoCaoTongKetMon = async (tenMonHoc, tenHocKy, tenNamHoc) => {
  try {
    const namHoc = await db.namhoc.findOne({ where: { TenNamHoc: tenNamHoc } });
    const hocKy = await db.hocky.findOne({ where: { TenHocKy: tenHocKy } });
    const monHoc = await db.monhoc.findOne({ where: { TenMonHoc: tenMonHoc } });

    if (!namHoc || !hocKy || !monHoc) {
      return {
        EM: 'Không tìm thấy thông tin nhập vào',
        EC: -1,
        DT: {}
      };
    }

    const danhSachLopList = await db.danhsachlop.findAll({
      where: { MaNamHoc: namHoc.MaNamHoc },
      include: [{ model: db.lop }]
    });

    const baoCao = await db.bctk_monhoc.create({
      MaNamHoc: namHoc.MaNamHoc,
      MaHocKy: hocKy.MaHocKy,
      MaMonHoc: monHoc.MaMonHoc
    });

    const thamSo = await db.thamso.findOne();
    const diemDat = parseFloat(thamSo?.DiemDat) || 5;

    console.log(diemDat);

    const ketQua = [];

    for (const dsl of danhSachLopList) {
      const dsCT = await db.ct_dsl.findAll({ where: { MaDanhSachLop: dsl.MaDanhSachLop } });

      let soLuongDat = 0;

      for (const ct of dsCT) {
        const qtHoc = await db.quatrinhhoc.findOne({
          where: { MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy }
        });
        if (!qtHoc) continue;

        const diemTBMonHoc = await calculateAndUpdateDiemTB(qtHoc.MaQuaTrinhHoc);
        console.log(diemTBMonHoc)
        const bdMon = await db.bdmonhoc.findOne({
          where: { MaQuaTrinhHoc: qtHoc.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc }
        });
        if (!bdMon) continue;

        const diemMon = await db.bdchitietmonhoc.findOne({
          where: { MaBDMonHoc: bdMon.MaBDMonHoc }
        });

        const diemTPMonHoc = diemMon?.DiemTPMonHoc || 0;

        if (diemTPMonHoc >= diemDat && diemTBMonHoc >= diemDat) {
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

      await db.ctbctk_mon.create({
        MaBCTKMonHoc: baoCao.MaBCTKMonHoc,
        MaDanhSachLop: dsl.MaDanhSachLop,
        SoLuongHS: siSo,
        SoLuongDat: soLuongDat,
        TiLe: tiLe
      });
    }

    return {
      EM: 'Tính báo cáo tổng kết môn học thành công',
      EC: 0,
      DT: {
        monHoc: tenMonHoc,
        hocKy: tenHocKy,
        namHoc: tenNamHoc,
        ketQua
      }
    };
  } catch (error) {
    console.error('Service Error:', error);
    return {
      EM: 'Lỗi khi tính báo cáo tổng kết môn',
      EC: -1,
      DT: {},
      error: error.message
    };
  }
};

module.exports = { 
  getOptions,
  getSubjectSummary,
  addScore,
  deleteScore,
  editScore,
  tinhBaoCaoTongKetHocKy,
  tinhBaoCaoTongKetMon,
};