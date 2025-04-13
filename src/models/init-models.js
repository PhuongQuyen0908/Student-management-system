var DataTypes = require("sequelize").DataTypes;
var _bangdiemmh = require("./bangdiemmh");
var _ct_bdmh = require("./ct_bdmh");
var _giaovien = require("./giaovien");
var _hocky = require("./hocky");
var _hocsinh = require("./hocsinh");
var _khoi = require("./khoi");
var _loaikiemtra = require("./loaikiemtra");
var _lop = require("./lop");
var _moiquanhe = require("./moiquanhe");
var _monhoc = require("./monhoc");
var _namhoc = require("./namhoc");
var _pcgiangday = require("./pcgiangday");
var _phuhuynhhs = require("./phuhuynhhs");
var _quatrinhhoc = require("./quatrinhhoc");
var _taikhoan = require("./taikhoan");
var _thamso = require("./thamso");

function initModels(sequelize) {
  var bangdiemmh = _bangdiemmh(sequelize, DataTypes);
  var ct_bdmh = _ct_bdmh(sequelize, DataTypes);
  var giaovien = _giaovien(sequelize, DataTypes);
  var hocky = _hocky(sequelize, DataTypes);
  var hocsinh = _hocsinh(sequelize, DataTypes);
  var khoi = _khoi(sequelize, DataTypes);
  var loaikiemtra = _loaikiemtra(sequelize, DataTypes);
  var lop = _lop(sequelize, DataTypes);
  var moiquanhe = _moiquanhe(sequelize, DataTypes);
  var monhoc = _monhoc(sequelize, DataTypes);
  var namhoc = _namhoc(sequelize, DataTypes);
  var pcgiangday = _pcgiangday(sequelize, DataTypes);
  var phuhuynhhs = _phuhuynhhs(sequelize, DataTypes);
  var quatrinhhoc = _quatrinhhoc(sequelize, DataTypes);
  var taikhoan = _taikhoan(sequelize, DataTypes);
  var thamso = _thamso(sequelize, DataTypes);

  giaovien.belongsToMany(monhoc, { as: 'MaMH_monhocs', through: pcgiangday, foreignKey: "MaGiaoVien", otherKey: "MaMH" });
  hocsinh.belongsToMany(phuhuynhhs, { as: 'MaPHHS_phuhuynhhs', through: moiquanhe, foreignKey: "MaHS", otherKey: "MaPHHS" });
  monhoc.belongsToMany(giaovien, { as: 'MaGiaoVien_giaoviens', through: pcgiangday, foreignKey: "MaMH", otherKey: "MaGiaoVien" });
  phuhuynhhs.belongsToMany(hocsinh, { as: 'MaHS_hocsinhs', through: moiquanhe, foreignKey: "MaPHHS", otherKey: "MaHS" });
  ct_bdmh.belongsTo(bangdiemmh, { as: "MaBangDiemMH_bangdiemmh", foreignKey: "MaBangDiemMH"});
  bangdiemmh.hasMany(ct_bdmh, { as: "ct_bdmhs", foreignKey: "MaBangDiemMH"});
  pcgiangday.belongsTo(giaovien, { as: "MaGiaoVien_giaovien", foreignKey: "MaGiaoVien"});
  giaovien.hasMany(pcgiangday, { as: "pcgiangdays", foreignKey: "MaGiaoVien"});
  quatrinhhoc.belongsTo(hocky, { as: "MaHocKy_hocky", foreignKey: "MaHocKy"});
  hocky.hasMany(quatrinhhoc, { as: "quatrinhhocs", foreignKey: "MaHocKy"});
  moiquanhe.belongsTo(hocsinh, { as: "MaHS_hocsinh", foreignKey: "MaHS"});
  hocsinh.hasMany(moiquanhe, { as: "moiquanhes", foreignKey: "MaHS"});
  quatrinhhoc.belongsTo(hocsinh, { as: "MaHS_hocsinh", foreignKey: "MaHS"});
  hocsinh.hasMany(quatrinhhoc, { as: "quatrinhhocs", foreignKey: "MaHS"});
  lop.belongsTo(khoi, { as: "MaKhoi_khoi", foreignKey: "MaKhoi"});
  khoi.hasMany(lop, { as: "lops", foreignKey: "MaKhoi"});
  ct_bdmh.belongsTo(loaikiemtra, { as: "MaLoaiKiemTra_loaikiemtra", foreignKey: "MaLoaiKiemTra"});
  loaikiemtra.hasMany(ct_bdmh, { as: "ct_bdmhs", foreignKey: "MaLoaiKiemTra"});
  quatrinhhoc.belongsTo(lop, { as: "MaLop_lop", foreignKey: "MaLop"});
  lop.hasMany(quatrinhhoc, { as: "quatrinhhocs", foreignKey: "MaLop"});
  bangdiemmh.belongsTo(monhoc, { as: "MaMH_monhoc", foreignKey: "MaMH"});
  monhoc.hasMany(bangdiemmh, { as: "bangdiemmhs", foreignKey: "MaMH"});
  pcgiangday.belongsTo(monhoc, { as: "MaMH_monhoc", foreignKey: "MaMH"});
  monhoc.hasMany(pcgiangday, { as: "pcgiangdays", foreignKey: "MaMH"});
  hocky.belongsTo(namhoc, { as: "MaNamHoc_namhoc", foreignKey: "MaNamHoc"});
  namhoc.hasMany(hocky, { as: "hockies", foreignKey: "MaNamHoc"});
  khoi.belongsTo(namhoc, { as: "MaNam_namhoc", foreignKey: "MaNam"});
  namhoc.hasMany(khoi, { as: "khois", foreignKey: "MaNam"});
  moiquanhe.belongsTo(phuhuynhhs, { as: "MaPHHS_phuhuynhh", foreignKey: "MaPHHS"});
  phuhuynhhs.hasMany(moiquanhe, { as: "moiquanhes", foreignKey: "MaPHHS"});
  bangdiemmh.belongsTo(quatrinhhoc, { as: "MaQTH_quatrinhhoc", foreignKey: "MaQTH"});
  quatrinhhoc.hasMany(bangdiemmh, { as: "bangdiemmhs", foreignKey: "MaQTH"});
  giaovien.belongsTo(taikhoan, { as: "MaTaiKhoan_taikhoan", foreignKey: "MaTaiKhoan"});
  taikhoan.hasMany(giaovien, { as: "giaoviens", foreignKey: "MaTaiKhoan"});

  return {
    bangdiemmh,
    ct_bdmh,
    giaovien,
    hocky,
    hocsinh,
    khoi,
    loaikiemtra,
    lop,
    moiquanhe,
    monhoc,
    namhoc,
    pcgiangday,
    phuhuynhhs,
    quatrinhhoc,
    taikhoan,
    thamso,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
