const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bctk_monhoc', {
    MaBCTKMonHoc: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaNamHoc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'namhoc',
        key: 'MaNamHoc'
      }
    },
    MaMonHoc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'monhoc',
        key: 'MaMonHoc'
      }
    },
    MaHocKy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hocky',
        key: 'MaHocKy'
      }
    }
  }, {
    sequelize,
    tableName: 'bctk_monhoc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaBCTKMonHoc" },
        ]
      },
      {
        name: "fk_bctkmonhoc_namhoc",
        using: "BTREE",
        fields: [
          { name: "MaNamHoc" },
        ]
      },
      {
        name: "fk_bctkmonhoc_hocky",
        using: "BTREE",
        fields: [
          { name: "MaHocKy" },
        ]
      },
      {
        name: "fk_bctkmonhoc_monhoc",
        using: "BTREE",
        fields: [
          { name: "MaMonHoc" },
        ]
      },
    ]
  });
};
