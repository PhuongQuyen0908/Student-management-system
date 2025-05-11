const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bdchitietmonhoc', {
    MaBDCTMonHoc: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaLoaiKiemTra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'loaikiemtra',
        key: 'MaLoaiKiemTra'
      }
    },
    MaBDMonHoc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bdmonhoc',
        key: 'MaBDMonHoc'
      }
    },
    DiemTPMonHoc: {
      type: DataTypes.FLOAT(4,2),
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
        name: "fk_bdctmonhoc_loaikiemtra",
        using: "BTREE",
        fields: [
          { name: "MaLoaiKiemTra" },
        ]
      },
      {
        name: "fk_bdctmonhoc_bdmonhoc",
        using: "BTREE",
        fields: [
          { name: "MaBDMonHoc" },
        ]
      },
    ]
  });
};
