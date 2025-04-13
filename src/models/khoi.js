const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('khoi', {
    MaKhoi: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenKhoi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MaNam: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'namhoc',
        key: 'MaNam'
      }
    }
  }, {
    sequelize,
    tableName: 'khoi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaKhoi" },
        ]
      },
      {
        name: "fk_khoi_namhoc",
        using: "BTREE",
        fields: [
          { name: "MaNam" },
        ]
      },
    ]
  });
};
