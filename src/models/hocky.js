const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hocky', {
    MaHocKy: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenHocKy: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MaNamHoc: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'namhoc',
        key: 'MaNam'
      }
    }
  }, {
    sequelize,
    tableName: 'hocky',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaHocKy" },
        ]
      },
      {
        name: "fk_hk_namhoc",
        using: "BTREE",
        fields: [
          { name: "MaNamHoc" },
        ]
      },
    ]
  });
};
