const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('giaovien', {
    MaGiaoVien: {
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
    MaTaiKhoan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'taikhoan',
        key: 'MaTaiKhoan'
      }
    }
  }, {
    sequelize,
    tableName: 'giaovien',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaGiaoVien" },
        ]
      },
      {
        name: "fk_MaTaiKhoan",
        using: "BTREE",
        fields: [
          { name: "MaTaiKhoan" },
        ]
      },
    ]
  });
};
