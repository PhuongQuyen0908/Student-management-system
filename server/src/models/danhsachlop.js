import { Sequelize } from "sequelize";
import db from '../models/index';

module.exports = function(sequelize, DataTypes) {
  const DanhSachLop = sequelize.define('danhsachlop', {
    MaDanhSachLop: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaNamHoc: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    MaLop: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    SiSo: {
        type: DataTypes.INTEGER,
        allowNull: true
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
      }
    ]
  });
  DanhSachLop.associate = (models) => {
    DanhSachLop.belongsTo(models.namhoc, { foreignKey: 'MaNamHoc', as: 'fk_namhoc' });
    DanhSachLop.belongsTo(models.lop, { foreignKey: 'MaLop', as: 'fk_lop' });
  };
  return DanhSachLop;

};