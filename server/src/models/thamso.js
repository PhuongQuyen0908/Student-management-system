const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('thamso', {
    TenThamSo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    GiaTri: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'thamso',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "TenThamSo" },
        ]
      },
    ]
  });
};
