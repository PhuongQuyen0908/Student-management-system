import sequelize from "sequelize";
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hocsinh', {
    MaHS: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, 
    },
    HoTen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DiaChi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SoDienThoai: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    NgaySinh: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    GioiTinh: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'hocsinh',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaHS" },
        ]
      },
    ]
  });
};