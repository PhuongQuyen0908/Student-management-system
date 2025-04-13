const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('phuhuynhhs', {
    MaPHHS: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenPHHS: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SoDienThoai: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    DiaChi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    MaHS: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'phuhuynhhs',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPHHS" },
        ]
      },
    ]
  });
};
