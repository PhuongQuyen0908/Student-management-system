const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('monhoc', {
    MaMH: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenMonHoc: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'monhoc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaMH" },
        ]
      },
    ]
  });
};
