const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bctk_hocky', {
    MaBCTKHocKy: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaDanhSachLop: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    MaNamHoc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'namhoc',
        key: 'MaNamHoc'
      }
    },
    MaHocKy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hocky',
        key: 'MaHocKy'
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
    tableName: 'bctk_hocky',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaBCTKHocKy" },
        ]
      },
      {
        name: "fk_bctkhocky_hocky",
        using: "BTREE",
        fields: [
          { name: "MaHocKy" },
        ]
      },
      {
        name: "fk_bctkhocky_namhoc",
        using: "BTREE",
        fields: [
          { name: "MaNamHoc" },
        ]
      },
    ]
  });
};
