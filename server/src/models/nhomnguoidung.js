// const Sequelize = require('sequelize');
// module.exports = function(sequelize, DataTypes) {
//   return sequelize.define('nhomnguoidung', {
//     MaNhom: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     TenNhom: {
//       type: DataTypes.STRING(50),
//       allowNull: false
//     }
//   }, {
//     sequelize,
//     tableName: 'nhomnguoidung',
//     timestamps: false,
//     indexes: [
//       {
//         name: "PRIMARY",
//         unique: true,
//         using: "BTREE",
//         fields: [
//           { name: "MaNhom" },
//         ]
//       },
//     ]
//   });
// };

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const nhomnguoidung = sequelize.define('nhomnguoidung', {
    MaNhom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenNhom: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'nhomnguoidung',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaNhom" },
        ]
      },
    ]
  });

  // Thêm associate để khai báo bảng trung gian phanquyen
  nhomnguoidung.associate = function(models) {
    nhomnguoidung.belongsToMany(models.chucnang, {
      through: models.phanquyen,   // bảng trung gian
      foreignKey: 'MaNhom',       // khóa ngoại của nhomnguoidung trong bảng trung gian
      otherKey: 'MaChucNang'      // khóa ngoại của chucnang trong bảng trung gian
    });
  };

  return nhomnguoidung;
};
