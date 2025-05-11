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
      allowNull: true
    },
    HeSo: {
      type: DataTypes.INTEGER,
      allowNull: true
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
