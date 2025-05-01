const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bdchitietmonhoc', {
    MaBDCTMonHoc: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaBDMonHoc: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    MaLoaiKiemTra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'loaikiemtra',
        key: 'MaLoaiKiemTra'
      }
    },
    DiemTPMonHoc: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'bdchitietmonhoc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaBDCTMonHoc" },
        ]
      },
      {
        name: "fk_bdctmonhoc_bdmonhoc",
        using: "BTREE",
        fields: [
          { name: "MaBDMonHoc" },
        ]
      },
      {
        name: "fk_bdctmonhoc_loaikiemtra",
        using: "BTREE",
        fields: [
          { name: "MaLoaiKiemTra" },
        ]
      },
    ]
  });
};
