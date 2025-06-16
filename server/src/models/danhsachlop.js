const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('danhsachlop', {
    MaDanhSachLop: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaNamHoc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'namhoc',
        key: 'MaNamHoc'
      }
    },
    MaLop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lop',
        key: 'MaLop'
      }
    },
    SiSo: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'danhsachlop',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaDanhSachLop" },
        ]
      },
      {
        name: "fk_dslop_namhoc",
        using: "BTREE",
        fields: [
          { name: "MaNamHoc" },
        ]
      },
      {
        name: "fk_dslop_lop",
        using: "BTREE",
        fields: [
          { name: "MaLop" },
        ]
      },
    ]
  });

};
