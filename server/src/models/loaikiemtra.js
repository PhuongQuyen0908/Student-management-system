const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('loaikiemtra', {
    MaLoaiKiemTra: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenLoaiKiemTra: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    HeSo: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 1.0
    },
    ThoiGianKT: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'loaikiemtra',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaLoaiKiemTra" },
        ]
      },
    ]
  });
};