const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('namhoc', {
    MaNamHoc: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenNamHoc: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Nam1: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    Nam2: {
      type: DataTypes.STRING(4),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'namhoc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaNamHoc" },
        ]
      },
    ]
  });
};
