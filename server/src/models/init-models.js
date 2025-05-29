var DataTypes = require("sequelize").DataTypes;
var _bctk_hocky = require("./bctk_hocky");
var _bctk_monhoc = require("./bctk_monhoc");
var _bdchitietmonhoc = require("./bdchitietmonhoc");
var _bdmonhoc = require("./bdmonhoc");
var _chucnang = require("./chucnang");
var _ct_dsl = require("./ct_dsl");
var _ctbctk_mon = require("./ctbctk_mon");
var _danhsachlop = require("./danhsachlop");
var _hocky = require("./hocky");
var _hocsinh = require("./hocsinh");
var _khoi = require("./khoi");
var _loaikiemtra = require("./loaikiemtra");
var _lop = require("./lop");
var _monhoc = require("./monhoc");
var _namhoc = require("./namhoc");
var _nguoidung = require("./nguoidung");
var _nhomnguoidung = require("./nhomnguoidung");
var _phanquyen = require("./phanquyen");
var _quatrinhhoc = require("./quatrinhhoc");
var _thamso = require("./thamso");

function initModels(sequelize) {
  var bctk_hocky = _bctk_hocky(sequelize, DataTypes);
  var bctk_monhoc = _bctk_monhoc(sequelize, DataTypes);
  var bdchitietmonhoc = _bdchitietmonhoc(sequelize, DataTypes);
  var bdmonhoc = _bdmonhoc(sequelize, DataTypes);
  var chucnang = _chucnang(sequelize, DataTypes);
  var ct_dsl = _ct_dsl(sequelize, DataTypes);
  var ctbctk_mon = _ctbctk_mon(sequelize, DataTypes);
  var danhsachlop = _danhsachlop(sequelize, DataTypes);
  var hocky = _hocky(sequelize, DataTypes);
  var hocsinh = _hocsinh(sequelize, DataTypes);
  var khoi = _khoi(sequelize, DataTypes);
  var loaikiemtra = _loaikiemtra(sequelize, DataTypes);
  var lop = _lop(sequelize, DataTypes);
  var monhoc = _monhoc(sequelize, DataTypes);
  var namhoc = _namhoc(sequelize, DataTypes);
  var nguoidung = _nguoidung(sequelize, DataTypes);
  var nhomnguoidung = _nhomnguoidung(sequelize, DataTypes);
  var phanquyen = _phanquyen(sequelize, DataTypes);
  var quatrinhhoc = _quatrinhhoc(sequelize, DataTypes);
  var thamso = _thamso(sequelize, DataTypes);

  ctbctk_mon.belongsTo(bctk_monhoc, { as: "MaBCTKMonHoc_bctk_monhoc", foreignKey: "MaBCTKMonHoc"});
  bctk_monhoc.hasMany(ctbctk_mon, { as: "ctbctk_mons", foreignKey: "MaBCTKMonHoc"});
  quatrinhhoc.belongsTo(ct_dsl, { as: "MaCT_DSL_ct_dsl", foreignKey: "MaCT_DSL"});
  ct_dsl.hasMany(quatrinhhoc, { as: "quatrinhhocs", foreignKey: "MaCT_DSL"});
  ct_dsl.belongsTo(danhsachlop, { as: "MaDanhSachLop_danhsachlop", foreignKey: "MaDanhSachLop"});
  danhsachlop.hasMany(ct_dsl, { as: "ct_dsls", foreignKey: "MaDanhSachLop"});
  ctbctk_mon.belongsTo(danhsachlop, { as: "MaDanhSachLop_danhsachlop", foreignKey: "MaDanhSachLop"});
  danhsachlop.hasMany(ctbctk_mon, { as: "ctbctk_mons", foreignKey: "MaDanhSachLop"});
  bctk_hocky.belongsTo(hocky, { as: "MaHocKy_hocky", foreignKey: "MaHocKy"});
  hocky.hasMany(bctk_hocky, { as: "bctk_hockies", foreignKey: "MaHocKy"});
  bctk_monhoc.belongsTo(hocky, { as: "MaHocKy_hocky", foreignKey: "MaHocKy"});
  hocky.hasMany(bctk_monhoc, { as: "bctk_monhocs", foreignKey: "MaHocKy"});
  quatrinhhoc.belongsTo(hocky, { as: "MaHocKy_hocky", foreignKey: "MaHocKy"});
  hocky.hasMany(quatrinhhoc, { as: "quatrinhhocs", foreignKey: "MaHocKy"});
  ct_dsl.belongsTo(hocsinh, { as: "MaHocSinh_hocsinh", foreignKey: "MaHocSinh"});
  hocsinh.hasMany(ct_dsl, { as: "ct_dsls", foreignKey: "MaHocSinh"});
  lop.belongsTo(khoi, { as: "MaKhoi_khoi", foreignKey: "MaKhoi"});
  khoi.hasMany(lop, { as: "lops", foreignKey: "MaKhoi"});
  bdchitietmonhoc.belongsTo(loaikiemtra, { as: "MaLoaiKiemTra_loaikiemtra", foreignKey: "MaLoaiKiemTra"});
  loaikiemtra.hasMany(bdchitietmonhoc, { as: "bdchitietmonhocs", foreignKey: "MaLoaiKiemTra"});
  danhsachlop.belongsTo(lop, { as: "MaLop_lop", foreignKey: "MaLop"});
  lop.hasMany(danhsachlop, { as: "danhsachlops", foreignKey: "MaLop"});
  bctk_monhoc.belongsTo(monhoc, { as: "MaMonHoc_monhoc", foreignKey: "MaMonHoc"});
  monhoc.hasMany(bctk_monhoc, { as: "bctk_monhocs", foreignKey: "MaMonHoc"});
  bdmonhoc.belongsTo(monhoc, { as: "MaMonHoc_monhoc", foreignKey: "MaMonHoc"});
  monhoc.hasMany(bdmonhoc, { as: "bdmonhocs", foreignKey: "MaMonHoc"});
  bctk_hocky.belongsTo(namhoc, { as: "MaNamHoc_namhoc", foreignKey: "MaNamHoc"});
  namhoc.hasMany(bctk_hocky, { as: "bctk_hockies", foreignKey: "MaNamHoc"});
  bctk_monhoc.belongsTo(namhoc, { as: "MaNamHoc_namhoc", foreignKey: "MaNamHoc"});
  namhoc.hasMany(bctk_monhoc, { as: "bctk_monhocs", foreignKey: "MaNamHoc"});
  danhsachlop.belongsTo(namhoc, { as: "MaNamHoc_namhoc", foreignKey: "MaNamHoc"});
  namhoc.hasMany(danhsachlop, { as: "danhsachlops", foreignKey: "MaNamHoc"});
  bdmonhoc.belongsTo(quatrinhhoc, { as: "MaQuaTrinhHoc_quatrinhhoc", foreignKey: "MaQuaTrinhHoc"});
  quatrinhhoc.hasMany(bdmonhoc, { as: "bdmonhocs", foreignKey: "MaQuaTrinhHoc"});

  return {
    bctk_hocky,
    bctk_monhoc,
    bdchitietmonhoc,
    bdmonhoc,
    chucnang,
    ct_dsl,
    ctbctk_mon,
    danhsachlop,
    hocky,
    hocsinh,
    khoi,
    loaikiemtra,
    lop,
    monhoc,
    namhoc,
    nguoidung,
    nhomnguoidung,
    phanquyen,
    quatrinhhoc,
    thamso,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
