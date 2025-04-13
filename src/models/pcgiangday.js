const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pcgiangday', {
    MaGiaoVien: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'giaovien',
        key: 'MaGiaoVien'
      }
    },
    MaMH: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'monhoc',
        key: 'MaMH'
      }
    }
  }, {
    sequelize,
    tableName: 'pcgiangday',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaGiaoVien" },
          { name: "MaMH" },
        ]
      },
      {
        name: "fk_MaMH",
        using: "BTREE",
        fields: [
          { name: "MaMH" },
        ]
      },
    ]
  });
};
