const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quatrinhhoc', {
    MaQuaTrinhHoc: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaCT_DSL: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ct_dsl',
        key: 'MaCT_DSL'
      }
    },
    MaHocKy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hocky',
        key: 'MaHocKy'
      }
    },
    DiemTBHocKy: {
      type: DataTypes.FLOAT(4,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'quatrinhhoc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaQuaTrinhHoc" },
        ]
      },
      {
        name: "fk_qth_hocky",
        using: "BTREE",
        fields: [
          { name: "MaHocKy" },
        ]
      },
      {
        name: "fk_qth_ctdsl",
        using: "BTREE",
        fields: [
          { name: "MaCT_DSL" },
        ]
      },
    ]
  });
};
