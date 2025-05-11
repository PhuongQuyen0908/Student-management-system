const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('nguoidung', {
    TenDangNhap: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    MatKhau: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    MaNhom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'nhomnguoidung',
        key: 'MaNhom'
      }
    }
  }, {
    sequelize,
    tableName: 'nguoidung',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "TenDangNhap" },
        ]
      },
      {
        name: "fk_nd_nhom",
        using: "BTREE",
        fields: [
          { name: "MaNhom" },
        ]
      },
    ]
  });
};
