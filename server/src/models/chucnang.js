// const Sequelize = require('sequelize');
// module.exports = function(sequelize, DataTypes) {
//   return sequelize.define('chucnang', {
//     MaChucNang: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     TenChucNang: {
//       type: DataTypes.STRING(50),
//       allowNull: false
//     },
//     TenManHinhDuocLoad: {
//       type: DataTypes.STRING(50),
//       allowNull: false
//     }
//   }, {
//     sequelize,
//     tableName: 'chucnang',
//     timestamps: false,
//     indexes: [
//       {
//         name: "PRIMARY",
//         unique: true,
//         using: "BTREE",
//         fields: [
//           { name: "MaChucNang" },
//         ]
//       },
//     ]
//   });
// };

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const chucnang = sequelize.define('chucnang', {
    MaChucNang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenChucNang: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    TenManHinhDuocLoad: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'chucnang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaChucNang" },
        ]
      },
    ]
  });

  // Thêm associate để khai báo bảng trung gian phanquyen
  chucnang.associate = function(models) {
    chucnang.belongsToMany(models.nhomnguoidung, {
      through: models.phanquyen,   // bảng trung gian
      foreignKey: 'MaChucNang',   // khóa ngoại của chucnang trong bảng trung gian
      otherKey: 'MaNhom'          // khóa ngoại của nhomnguoidung trong bảng trung gian
    });
  };

  return chucnang;
};
