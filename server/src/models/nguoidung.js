const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const nguoidung = sequelize.define('nguoidung', {
    TenDangNhap: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    HoTen: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    SoDienThoai: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    MatKhau: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
 
    MaNhom: {
      type: DataTypes.INTEGER,
      allowNull: false
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
        fields: [ { name: "TenDangNhap" } ]
      },
      {
        name: "fk_nd_nhom",
        using: "BTREE",
        fields: [ { name: "MaNhom" } ]
      },
    ]
  });

  // Thêm quan hệ belongsTo đến nhomnguoidung
  nguoidung.associate = function(models) {
    nguoidung.belongsTo(models.nhomnguoidung, {
      foreignKey: 'MaNhom'
    });
  };

  return nguoidung;
};
