const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ct_dsl', {
    MaCT_DSL: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaDanhSachLop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'danhsachlop',
        key: 'MaDanhSachLop'
      }
    },
    MaHocSinh: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hocsinh',
        key: 'MaHocSinh'
      }
    }
  }, {
    sequelize,
    tableName: 'ct_dsl',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaCT_DSL" },
        ]
      },
      {
        name: "fk_ctdsl_dsl",
        using: "BTREE",
        fields: [
          { name: "MaDanhSachLop" },
        ]
      },
      {
        name: "fk_ctdsl_hs",
        using: "BTREE",
        fields: [
          { name: "MaHocSinh" },
        ]
      },
    ]
  });

  CT_DSL.associate = function(models) {
    CT_DSL.belongsTo(models.hocsinh, {
      foreignKey: 'MaHocSinh',
      targetKey: 'MaHocSinh'
    });
    CT_DSL.belongsTo(models.danhsachlop, {
      foreignKey: 'MaDanhSachLop',
      targetKey: 'MaDanhSachLop'
    });
  };

  return CT_DSL;
};
