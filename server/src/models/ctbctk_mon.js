const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ctbctk_mon', {
    MaCTBCTKMon: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaBCTKMonHoc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bctk_monhoc',
        key: 'MaBCTKMonHoc'
      }
    },
    MaDanhSachLop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'danhsachlop',
        key: 'MaDanhSachLop'
      }
    },
    SoLuongHS: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    SoLuongDat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    TiLe: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ctbctk_mon',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaCTBCTKMon" },
        ]
      },
      {
        name: "fk_ctbctkmon_dslop",
        using: "BTREE",
        fields: [
          { name: "MaDanhSachLop" },
        ]
      },
      {
        name: "fk_ctbctkmon_bctkmh",
        using: "BTREE",
        fields: [
          { name: "MaBCTKMonHoc" },
        ]
      },
    ]
  });
};
