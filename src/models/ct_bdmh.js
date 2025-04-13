const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ct_bdmh', {
    MaCTBDMH: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaLoaiKiemTra: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'loaikiemtra',
        key: 'MaLoaiKiemTra'
      }
    },
    DiemKiemTra: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    MaBangDiemMH: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'bangdiemmh',
        key: 'MaBangDiemMH'
      }
    }
  }, {
    sequelize,
    tableName: 'ct_bdmh',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaCTBDMH" },
        ]
      },
      {
        name: "fk_ctbdmh_bdmh",
        using: "BTREE",
        fields: [
          { name: "MaBangDiemMH" },
        ]
      },
      {
        name: "fk_ctbdmn_loaikt",
        using: "BTREE",
        fields: [
          { name: "MaLoaiKiemTra" },
        ]
      },
    ]
  });
};
