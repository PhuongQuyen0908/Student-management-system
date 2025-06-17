import db from "../models/index.js";
const { Op, Sequelize } = db.Sequelize;
const { hocsinh, ct_dsl, bdchitietmonhoc, loaikiemtra, danhsachlop, lop, bdmonhoc, monhoc } = db;
import { applySort } from './sortHelper';

db.ct_dsl.belongsTo(db.hocsinh, { foreignKey: 'MaHocSinh' });
db.bdchitietmonhoc.belongsTo(db.loaikiemtra, { foreignKey: 'MaLoaiKiemTra' });
db.danhsachlop.belongsTo(db.lop, { foreignKey: 'MaLop' });
db.bdmonhoc.belongsTo(db.monhoc, { foreignKey: 'MaMonHoc' });

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
    //Sắp xếp năm học mới nhất lên trước 
    namHoc.sort((a, b) => b.TenNamHoc.localeCompare(a.TenNamHoc));
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

const getOptionsReport = async () => {
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
  const bdChiTietList = await db.bdchitietmonhoc.findAll({
    where: { MaBDMonHoc },
    include: [{
      model: db.loaikiemtra,
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

  //Cập nhật điểm tb môn học
  await db.bdmonhoc.update(
    { DiemTBMonHoc: diemTB },
    { where: { MaBDMonHoc } }
  );

  //Cập nhật điểm tb học kỳ
  const bdMonhoc = await db.bdmonhoc.findByPk(MaBDMonHoc);
  if (bdMonhoc){
    const maQuaTrinhHoc = bdMonhoc.MaQuaTrinhHoc;
    //Lấy tất cả điểm TB môn học của quá trình học này
    const allBDMonHoc = await db.bdmonhoc.findAll({ where: { MaQuaTrinhHoc: maQuaTrinhHoc } }); 
    const diemTBs = allBDMonHoc.map(bd => bd.DiemTBMonHoc).filter(diem => diem !== null && diem !== undefined);
    const diemTBHocKy = diemTBs.length > 0 ? parseFloat((diemTBs.reduce((a, b) => a + b, 0) / diemTBs.length).toFixed(2)) : null;
    await db.quatrinhhoc.update(
      { DiemTBHocKy: diemTBHocKy },
      { where: { MaQuaTrinhHoc: maQuaTrinhHoc } }
    );
  }
  return diemTB;
};
 
// const getSubjectSummary = async (tenLop, tenHocKy, tenNamHoc, tenMonHoc) => {
//   try {

//     if (!tenLop || !tenHocKy || !tenNamHoc || !tenMonHoc) {
//       return { EM: 'Thông tin nhập không đầy đủ', EC: -1, DT: null };
//     }

//     const lop = await db.lop.findOne({ where: { TenLop: tenLop } });
//     const namHoc = await db.namhoc.findOne({ where: { TenNamHoc: tenNamHoc } });
//     const hocKy = await db.hocky.findOne({ where: { TenHocKy: tenHocKy } });
//     const monHoc = await db.monhoc.findOne({ where: { TenMonHoc: tenMonHoc } });
    
//     console.log(lop);
//     if (!lop || !namHoc || !hocKy || !monHoc) {
//       return { EM: 'Không tìm thấy thông tin', EC: -1, DT: null };
//     }

//     const danhSachLop = await db.danhsachlop.findOne({
//       where: {
//         MaLop: lop.MaLop,
//         MaNamHoc: namHoc.MaNamHoc,
//       },
//     });

//     if (!danhSachLop) {
//       return { EM: 'Không tìm thấy lớp', EC: -1, DT: null };
//     }

//     const ctDsl = await db.ct_dsl.findAll({
//       where: { MaDanhSachLop: danhSachLop.MaDanhSachLop },
//       include: [
//         {
//           model: db.hocsinh,
//           attributes: ['HoTen', 'MaHocSinh'],
//           required: true, 
//         },
//       ],
//     });

//     const maCTs = ctDsl.map(item => item.MaCT_DSL);

//     const quaTrinhHocList = await db.quatrinhhoc.findAll({
//       where: {
//         MaCT_DSL: { [Op.in]: maCTs },
//         MaHocKy: hocKy.MaHocKy
//       }
//     });

//     const maQTHs = quaTrinhHocList.map(qth => qth.MaQuaTrinhHoc);

//     const bdMonHocList = await db.bdmonhoc.findAll({
//       where: {
//         MaQuaTrinhHoc: { [Op.in]: maQTHs },
//         MaMonHoc: monHoc.MaMonHoc
//       }
//     });

//     const maBDs = bdMonHocList.map(bd => bd.MaBDMonHoc);

//     const bdChiTietList = await db.bdchitietmonhoc.findAll({
//       where: {
//         MaBDMonHoc: { [Op.in]: maBDs }
//       },
//       include: [
//         {
//           model: db.loaikiemtra,
//           attributes: ['TenLoaiKiemTra', 'HeSo']
//         }
//       ]
//     });

//     const data = await Promise.all(ctDsl.map(async (ct) => {
//       const hocSinh = ct.hocsinh?.HoTen || "Không xác định";
//       const maHocSinh = ct.hocsinh?.MaHocSinh;
//       const qth = quaTrinhHocList.find(q => q.MaCT_DSL === ct.MaCT_DSL);
//       const bdMonHoc = qth
//         ? bdMonHocList.find(bd => bd.MaQuaTrinhHoc === qth.MaQuaTrinhHoc)
//         : null;
    
//       const diemTP = bdMonHoc
//         ? bdChiTietList
//             .filter(bd => bd.MaBDMonHoc === bdMonHoc.MaBDMonHoc)
//             .map(bd => ({
//               LoaiKiemTra: bd.loaikiemtra?.TenLoaiKiemTra || "Không rõ",
//               Diem: bd.DiemTPMonHoc,
//               HeSo: bd.loaikiemtra?.HeSo || 1
//             }))
//         : [];
    
//       const diemTB = bdMonHoc
//         ? await calculateAndUpdateDiemTB(bdMonHoc.MaBDMonHoc)
//         : null;
    
//       return {
//         HoTen: hocSinh,
//         MaHocSinh: maHocSinh,
//         DiemTP: diemTP,
//         DiemTB: diemTB
//       };
//     }));
    

//   const summary = {
//     TenLop: tenLop,
//     TenMonHoc: tenMonHoc,
//     TenHocKy: tenHocKy,
//     TenNamHoc: tenNamHoc,
//     DiemChiTiet: data
//   };

//   return {
//     EM: 'OK',
//     EC: 0,
//     DT: summary
//   };

// } catch (error) {
//   console.error("Lỗi getSubjectSummary: ", error);
//   return {
//     EM: 'Lỗi khi truy vấn',
//     EC: -1,
//     DT: null
//   };
// }
// };

const getSubjectSummary = async (tenLop, tenHocKy, tenNamHoc, tenMonHoc, page = 1, limit = 10, search = '', sortField = 'HoTen', sortOrder = 'ASC') => {
  try {
    // Phần lấy thông tin ban đầu giữ nguyên
    if (!tenLop || !tenHocKy || !tenNamHoc || !tenMonHoc) {
      return { EM: 'Thông tin nhập không đầy đủ', EC: -1, DT: null };
    }
    const lop = await db.lop.findOne({ where: { TenLop: tenLop } });
    const namHoc = await db.namhoc.findOne({ where: { TenNamHoc: tenNamHoc } });
    const hocKy = await db.hocky.findOne({ where: { TenHocKy: tenHocKy } });
    const monHoc = await db.monhoc.findOne({ where: { TenMonHoc: tenMonHoc } });
    if (!lop || !namHoc || !hocKy || !monHoc) {
      return { EM: 'Không tìm thấy thông tin', EC: -1, DT: null };
    }
    const danhSachLop = await db.danhsachlop.findOne({ where: { MaLop: lop.MaLop, MaNamHoc: namHoc.MaNamHoc } });
    if (!danhSachLop) {
      return { EM: 'Không tìm thấy lớp', EC: -1, DT: null };
    }

    // --- LOGIC MỚI CHO SẮP XẾP NÂNG CAO ---
    const offset = (page - 1) * limit;

    //Chức năng tìm kiếm
    let mainWhereClause = { MaDanhSachLop: danhSachLop.MaDanhSachLop };
        const cleanSearch = search.trim(); // Loại bỏ khoảng trắng thừa

        if (cleanSearch) {
            const numericSearch = parseFloat(cleanSearch);
            // Kiểm tra có phải là số thuần túy không (không chứa ký tự khác)
            const isNumericSearch = !isNaN(numericSearch) && /^\d+(\.\d+)?$/.test(cleanSearch);

            if (isNumericSearch) {
                // NẾU TÌM THEO SỐ: tìm học sinh có điểm đó
                mainWhereClause = {
                    ...mainWhereClause,
                    [Op.and]: [
                        Sequelize.literal(`
                            EXISTS (
                                SELECT 1 FROM quatrinhhoc qth
                                JOIN bdmonhoc bdm ON qth.MaQuaTrinhHoc = bdm.MaQuaTrinhHoc
                                JOIN bdchitietmonhoc bdct ON bdm.MaBDMonHoc = bdct.MaBDMonHoc
                                WHERE qth.MaCT_DSL = ct_dsl.MaCT_DSL 
                                  AND bdm.MaMonHoc = ${monHoc.MaMonHoc}
                                  AND qth.MaHocKy = ${hocKy.MaHocKy}
                                  AND bdct.DiemTPMonHoc = ${numericSearch}
                            )
                        `)
                    ]
                };
            } else {
                // NẾU TÌM THEO CHỮ: tìm theo tên với điều kiện AND cho mỗi từ
                const terms = cleanSearch.split(/\s+/).filter(Boolean);
                const nameConditions = terms.map(term => ({
                    // Sử dụng cú pháp '$model.column$' để tham chiếu đến cột của bảng được include
                    '$hocsinh.HoTen$': { [Op.like]: `%${term}%` }
                }));

                mainWhereClause = {
                    ...mainWhereClause,
                    [Op.and]: nameConditions
                };
            }
        }


    let orderClause = [];
    const mainQueryAttributes = ['MaCT_DSL', 'MaHocSinh', 'MaDanhSachLop'];
    
    // Đảm bảo sortOrder an toàn
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const allTestTypes = await db.loaikiemtra.findAll({ attributes: ['TenLoaiKiemTra'], raw: true });
    const testTypeNames = allTestTypes.map(t => t.TenLoaiKiemTra.trim());
    if (sortField === 'MaHocSinh') {
      // Sort by MaHocSinh directly
      orderClause.push([db.hocsinh, 'MaHocSinh', safeSortOrder]);
    }
    else if (testTypeNames.includes(sortField)) {
        // Sắp xếp theo cột điểm thành phần bằng subquery
        const subQuery = `(
            SELECT AVG(DiemTPMonHoc) FROM bdchitietmonhoc AS bdct
            INNER JOIN bdmonhoc AS bdm ON bdct.MaBDMonHoc = bdm.MaBDMonHoc
            INNER JOIN quatrinhhoc AS qth ON bdm.MaQuaTrinhHoc = qth.MaQuaTrinhHoc
            INNER JOIN loaikiemtra AS lkt ON bdct.MaLoaiKiemTra = lkt.MaLoaiKiemTra
            WHERE qth.MaCT_DSL = ct_dsl.MaCT_DSL 
            AND bdm.MaMonHoc = ${monHoc.MaMonHoc}
            AND qth.MaHocKy = ${hocKy.MaHocKy}
            AND TRIM(lkt.TenLoaiKiemTra) = '${sortField}'
        )`;
        mainQueryAttributes.push([Sequelize.literal(subQuery), 'sort_score']);
        orderClause.push([Sequelize.col('sort_score'), safeSortOrder]);
    } else {
        orderClause.push([db.hocsinh, 'HoTen', safeSortOrder]);
    }

    const { count, rows: ctDsl } = await db.ct_dsl.findAndCountAll({
      attributes: mainQueryAttributes,
      where: mainWhereClause,
      include: [{
          model: db.hocsinh,
          attributes: ['HoTen', 'MaHocSinh'],
          required: true,
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: orderClause,
      distinct: true, // Quan trọng để count hoạt động đúng
      subQuery: false // Cần thiết khi có subquery phức tạp trong where/order
    });
    
    // === Phần lấy điểm chi tiết và tính điểm TB giữ nguyên ===
    const maCTs = ctDsl.map(item => item.MaCT_DSL);
    if(maCTs.length === 0) {
        // Trả về rỗng nếu không có học sinh nào phù hợp
        return { EM: 'OK', EC: 0, DT: { TenLop: tenLop, TenMonHoc: tenMonHoc, TenHocKy: tenHocKy, TenNamHoc: tenNamHoc, DiemChiTiet: { rows: [], count: 0 } }};
    }
    const quaTrinhHocList = await db.quatrinhhoc.findAll({ where: { MaCT_DSL: { [Op.in]: maCTs }, MaHocKy: hocKy.MaHocKy } });
    const maQTHs = quaTrinhHocList.map(qth => qth.MaQuaTrinhHoc);
    const bdMonHocList = await db.bdmonhoc.findAll({ where: { MaQuaTrinhHoc: { [Op.in]: maQTHs }, MaMonHoc: monHoc.MaMonHoc } });
    const maBDs = bdMonHocList.map(bd => bd.MaBDMonHoc);
    const bdChiTietList = await db.bdchitietmonhoc.findAll({ where: { MaBDMonHoc: { [Op.in]: maBDs } }, include: [{ model: db.loaikiemtra, attributes: ['TenLoaiKiemTra', 'HeSo'] }] });

    let data = await Promise.all(ctDsl.map(async (ct) => {
      const qth = quaTrinhHocList.find(q => q.MaCT_DSL === ct.MaCT_DSL);
      const bdMonHoc = qth ? bdMonHocList.find(bd => bd.MaQuaTrinhHoc === qth.MaQuaTrinhHoc) : null;
      const diemTP = bdMonHoc ? bdChiTietList.filter(bd => bd.MaBDMonHoc === bdMonHoc.MaBDMonHoc).map(bd => ({ LoaiKiemTra: bd.loaikiemtra?.TenLoaiKiemTra || "Không rõ", Diem: bd.DiemTPMonHoc, HeSo: bd.loaikiemtra?.HeSo || 1 })) : [];
      const diemTB = bdMonHoc ? await calculateAndUpdateDiemTB(bdMonHoc.MaBDMonHoc) : null;
      return { HoTen: ct.hocsinh.HoTen, MaHocSinh: ct.hocsinh.MaHocSinh, DiemTP: diemTP, DiemTB: diemTB };
    }));
    
    // Sắp xếp theo Điểm TB (post-processing vì nó được tính toán)
    if (sortField === 'DiemTB') {
      data.sort((a, b) => {
        const valA = a.DiemTB === null ? -Infinity : a.DiemTB;
        const valB = b.DiemTB === null ? -Infinity : b.DiemTB;
        return safeSortOrder === 'ASC' ? valA - valB : valB - valA;
      });
    }
    const summary = {
      TenLop: tenLop,
      TenMonHoc: tenMonHoc,
      TenHocKy: tenHocKy,
      TenNamHoc: tenNamHoc,
      DiemChiTiet: { rows: data, count: count }
    };

    return { EM: 'OK', EC: 0, DT: summary };

  } catch (error) {
    console.error("Lỗi getSubjectSummary: ", error);
    return { EM: 'Lỗi khi truy vấn', EC: -1, DT: null };
  }
};

const addScore = async (MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP) => {
  try {
    const lop = await db.lop.findOne({ where: { TenLop } });
    const monHoc = await db.monhoc.findOne({ where: { TenMonHoc } });
    const hocKy = await db.hocky.findOne({ where: { TenHocKy } });
    const namHoc = await db.namhoc.findOne({ where: { TenNamHoc } });
    const hocSinh = await db.hocsinh.findByPk(MaHocSinh);

    if (!lop || !monHoc || !hocKy || !namHoc || !hocSinh) {
      return { EM: 'Không tìm thấy thông tin học sinh', EC: -1, DT: null };
    }

    // Validation logic for scores
    const minScore = await getThamSo("DiemToiThieu");
    const maxScore = await getThamSo("DiemToiDa");

    for (const d of DiemTP) {
      const diemSo = parseFloat(d.Diem);
      if (isNaN(diemSo) || diemSo < minScore || diemSo > maxScore) {
        return { EM: `Điểm ${diemSo} không hợp lệ. Phải nằm trong khoảng từ ${minScore} đến ${maxScore}.`, EC: -1, DT: null }
      }
    }

    // Find related records
    const dsl = await db.danhsachlop.findOne({ where: { MaLop: lop.MaLop, MaNamHoc: namHoc.MaNamHoc } });
    if (!dsl) return { EM: 'Không tìm thấy danh sách lớp', EC: -1, DT: null };

    const ct = await db.ct_dsl.findOne({ where: { MaDanhSachLop: dsl.MaDanhSachLop, MaHocSinh } });
    if (!ct) return { EM: 'Học sinh không thuộc lớp này', EC: -1, DT: null };

    // Find or create the study process
    let qth = await db.quatrinhhoc.findOne({ where: { MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy } });
    if (!qth) qth = await db.quatrinhhoc.create({ MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy });

    // Find or create the subject grade record
    let bd = await db.bdmonhoc.findOne({ where: { MaQuaTrinhHoc: qth.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc } });
    if (!bd) bd = await db.bdmonhoc.create({ MaQuaTrinhHoc: qth.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc });

    const createdChiTietList = [];

    for (const item of DiemTP) {
      const loai = await db.loaikiemtra.findOne({ where: { TenLoaiKiemTra: item.LoaiKiemTra } });
      if (!loai) continue;

      // Check if this score type already exists
      const existingScore = await db.bdchitietmonhoc.findOne({
        where: {
          MaBDMonHoc: bd.MaBDMonHoc,
          MaLoaiKiemTra: loai.MaLoaiKiemTra
        }
      });

      if (existingScore) {
        return { EM: `Điểm ${item.LoaiKiemTra} đã tồn tại. Hãy sử dụng chức năng sửa điểm.`, EC: -1, DT: [] };
      }

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
  } catch (error) {
    console.error("Lỗi thêm điểm: ", error);
    return {
      EM: 'Lỗi khi thêm điểm',
      EC: -1,
      DT: []
    };
  }
};

const deleteScore = async (MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP) => {
  try {
    const lop = await db.lop.findOne({ where: { TenLop } });
    const monHoc = await db.monhoc.findOne({ where: { TenMonHoc } });
    const hocKy = await db.hocky.findOne({ where: { TenHocKy } });
    const namHoc = await db.namhoc.findOne({ where: { TenNamHoc } });
    const hocSinh = await db.hocsinh.findByPk(MaHocSinh);

    if (!lop || !monHoc || !hocKy || !namHoc || !hocSinh) {
      return { EM: 'Không tìm thấy thông tin', EC: -1, DT: null };
    }

    // Find related records
    const dsl = await db.danhsachlop.findOne({ where: { MaLop: lop.MaLop, MaNamHoc: namHoc.MaNamHoc } });
    if (!dsl) return { EM: 'Không tìm thấy danh sách lớp', EC: -1, DT: null };

    const ct = await db.ct_dsl.findOne({ where: { MaDanhSachLop: dsl.MaDanhSachLop, MaHocSinh } });
    if (!ct) return { EM: 'Học sinh không thuộc lớp này', EC: -1, DT: null };

    const qth = await db.quatrinhhoc.findOne({ where: { MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy } });
    if (!qth) return { EM: 'Không tìm thấy quá trình học', EC: -1, DT: null };

    const bd = await db.bdmonhoc.findOne({ where: { MaQuaTrinhHoc: qth.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc } });
    if (!bd) return { EM: 'Không tìm thấy bảng điểm môn học', EC: -1, DT: null };

    const destroyScoreList = [];
    for (const item of DiemTP) {
      const loai = await db.loaikiemtra.findOne({ where: { TenLoaiKiemTra: item.LoaiKiemTra } });
      if (!loai) continue;

      const deleted = await db.bdchitietmonhoc.destroy({
        where: {
          MaBDMonHoc: bd.MaBDMonHoc,
          MaLoaiKiemTra: loai.MaLoaiKiemTra,
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
  } catch (error) {
    console.error("Lỗi xóa điểm: ", error);
    return {
      EM: 'Lỗi khi xóa điểm',
      EC: -1,
      DT: []
    };
  }
};

const editScore = async (MaHocSinh, TenLop, TenMonHoc, TenHocKy, TenNamHoc, DiemTP) => {
  try {
    const lop = await db.lop.findOne({ where: { TenLop } });
    const monHoc = await db.monhoc.findOne({ where: { TenMonHoc } });
    const hocKy = await db.hocky.findOne({ where: { TenHocKy } });
    const namHoc = await db.namhoc.findOne({ where: { TenNamHoc } });
    const hocSinh = await db.hocsinh.findByPk(MaHocSinh);

    if (!lop || !monHoc || !hocKy || !namHoc || !hocSinh) {
      return { EM: 'Không tìm thấy thông tin học sinh', EC: -1, DT: [] };
    }

    const minScore = await getThamSo("DiemToiThieu");
    const maxScore = await getThamSo("DiemToiDa");

    for (const d of DiemTP) {
      const diemSo = parseFloat(d.Diemmoi);
      if (isNaN(diemSo) || diemSo < minScore || diemSo > maxScore) {
        return { 
          EM: `Điểm ${diemSo} không hợp lệ. Phải nằm trong khoảng từ ${minScore} đến ${maxScore}.`, 
          EC: -1, 
          DT: [] 
        };
      }
    }

    // Find related records
    const dsl = await db.danhsachlop.findOne({ where: { MaLop: lop.MaLop, MaNamHoc: namHoc.MaNamHoc } });
    if (!dsl) return { EM: 'Không tìm thấy danh sách lớp', EC: -1, DT: [] };

    const ct = await db.ct_dsl.findOne({ where: { MaDanhSachLop: dsl.MaDanhSachLop, MaHocSinh } });
    if (!ct) return { EM: 'Học sinh không thuộc lớp này', EC: -1, DT: [] };

    const qth = await db.quatrinhhoc.findOne({ where: { MaCT_DSL: ct.MaCT_DSL, MaHocKy: hocKy.MaHocKy } });
    if (!qth) return { EM: 'Không tìm thấy quá trình học', EC: -1, DT: [] };

    const bd = await db.bdmonhoc.findOne({ where: { MaQuaTrinhHoc: qth.MaQuaTrinhHoc, MaMonHoc: monHoc.MaMonHoc } });
    if (!bd) return { EM: 'Không tìm thấy bảng điểm môn học', EC: -1, DT: [] };

    // Process each score update
    const editScoreList = [];
    for (const item of DiemTP) {
      const loai = await db.loaikiemtra.findOne({ where: { TenLoaiKiemTra: item.LoaiKiemTra } });
      if (!loai) continue;

      // Check if record exists before trying to update
      const existingRecord = await db.bdchitietmonhoc.findOne({
        where: {
          MaBDMonHoc: bd.MaBDMonHoc,
          MaLoaiKiemTra: loai.MaLoaiKiemTra,
        }
      });

      let result;
      if (existingRecord) {
        // Update existing record
        result = await db.bdchitietmonhoc.update(
          { DiemTPMonHoc: item.Diemmoi },
          {
            where: {
              MaBDMonHoc: bd.MaBDMonHoc,
              MaLoaiKiemTra: loai.MaLoaiKiemTra,
            },
          }
        );
      } else {
        // Create new record if it doesn't exist
        result = await db.bdchitietmonhoc.create({
          MaBDMonHoc: bd.MaBDMonHoc,
          MaLoaiKiemTra: loai.MaLoaiKiemTra,
          DiemTPMonHoc: item.Diemmoi
        });
      }

      editScoreList.push(result);
    }

    // Recalculate average score
    await calculateAndUpdateDiemTB(bd.MaBDMonHoc);

    return {
      EM: 'Chỉnh sửa điểm thành công',
      EC: 0,
      DT: editScoreList
    };
  } catch (error) {
    console.error("Lỗi chỉnh sửa điểm: ", error);
    return {
      EM: 'Lỗi khi chỉnh sửa điểm',
      EC: -1,
      DT: []
    };
  }
};

function filterBySearchField(data, searchTerm, field) {
  if (!searchTerm || !Array.isArray(data)) return data;

  const lowerTerm = searchTerm.toLowerCase();

  return data.filter((item) => {
    switch (field) {
      case 'lop':
        return (item.lop || '').toLowerCase().includes(lowerTerm);

      case 'siSo':
        return String(item.siSo).toLowerCase().includes(lowerTerm);

      case 'soLuongDat':
        return String(item.soLuongDat).toLowerCase().includes(lowerTerm);

      case 'tiLe':
        return String(item.tiLe).toLowerCase().includes(lowerTerm);

      case 'all':
        return (
          (item.lop || '').toLowerCase().includes(lowerTerm) ||
          String(item.siSo).toLowerCase().includes(lowerTerm) ||
          String(item.soLuongDat).toLowerCase().includes(lowerTerm) ||
          String(item.tiLe).toLowerCase().includes(lowerTerm)
        );

      default:
        return true;
    }
  });
}

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


const tinhBaoCaoTongKetHocKy = async ({
  tenHocKy,
  tenNamHoc,
  searchTerm = '',
  searchField = 'all',
  sortBy = null,
  order = 'asc'
}) => {
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

        const diemTBHK = await tinhDiemTBHocKy(qt.MaQuaTrinhHoc);
        if (diemTBHK !== null && diemTBHK >= diemDat) {
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

    // Lọc, sắp xếp, chuẩn hóa
    const ketQuaFiltered = filterBySearchField(ketQua, searchTerm, searchField);
    const ketQuaSorted = applySort(ketQuaFiltered, sortBy, order);
    const ketQuaFinal = normalizeKetQua(ketQuaSorted);

    return {
      EM: 'Tính báo cáo tổng kết học kỳ thành công',
      EC: 0,
      DT: {
        hocKy: tenHocKy,
        namHoc: tenNamHoc,
        ketQua: ketQuaFinal
      }
    };
  } catch (error) {
    console.error('❌ Service Error:', error);
    return {
      EM: 'Lỗi khi tính toán báo cáo học kỳ',
      EC: -1,
      DT: {},
      error: error.message
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

function normalizeKetQua(ketQuaRaw) {
  return ketQuaRaw.map((item, idx) => {
    const tiLeStr = typeof item.tiLe === 'string' ? item.tiLe.replace('%', '') : item.tiLe;
    const tiLeNum = parseFloat(tiLeStr);

    return {
      stt: Number(item.stt || idx + 1),
      lop: String(item.lop || '[Không xác định]'),
      siSo: Number(item.siSo || 0),
      soLuongDat: Number(item.soLuongDat || 0),
      tiLe: tiLeNum.toFixed(2) + '%' // luôn ở dạng 'xx.xx%'
    };
  });
}

const tinhBaoCaoTongKetMon = async (
  tenMonHoc,
  tenHocKy,
  tenNamHoc,
  searchTerm = '',
  searchField = 'all', // 👈 thêm searchField
  sortBy = null,
  order = 'asc'
) => {
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

    const diemDatRecord = await db.thamso.findOne({ where: { TenThamSo: 'DiemDat' } });
    const diemDat = parseFloat(diemDatRecord?.GiaTri) || 5;

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

      console.log(ketQua);
      await db.ctbctk_mon.create({
        MaBCTKMonHoc: baoCao.MaBCTKMonHoc,
        MaDanhSachLop: dsl.MaDanhSachLop,
        SoLuongHS: siSo,
        SoLuongDat: soLuongDat,
        TiLe: tiLe
      });
    }

    const ketQuaLoc = filterBySearchField(ketQua, searchTerm, searchField);
const ketQuaSorted = applySort(ketQuaLoc, sortBy, order);  // ⬅️ thêm dòng này
const ketQuaNormalized = normalizeKetQua(ketQuaSorted);

    console.log("✅ Kết quả cuối cùng:", ketQuaNormalized);

    return {
      EM: 'Tính báo cáo tổng kết môn học thành công',
      EC: 0,
      DT: {
        monHoc: tenMonHoc,
        hocKy: tenHocKy,
        namHoc: tenNamHoc,
        ketQua: ketQuaNormalized
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
  getOptionsReport,
  filterBySearchField,
  normalizeKetQua,
};