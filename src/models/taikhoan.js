const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('taikhoan', {
    MaTaiKhoan: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenTaiKhoan: {
      type: DataTypes.STRING(100),
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
    IsNull: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'taikhoan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaTaiKhoan" },
        ]
      },
    ]
  });
};
