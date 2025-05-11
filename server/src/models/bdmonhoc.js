const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bdmonhoc', {
    MaBDMonHoc: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaQuaTrinhHoc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'quatrinhhoc',
        key: 'MaQuaTrinhHoc'
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
    DiemTBMonHoc: {
      type: DataTypes.FLOAT(4,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'bdmonhoc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaBDMonHoc" },
        ]
      },
      {
        name: "fk_bdmh_monhoc",
        using: "BTREE",
        fields: [
          { name: "MaMonHoc" },
        ]
      },
      {
        name: "fk_bdmh_qth",
        using: "BTREE",
        fields: [
          { name: "MaQuaTrinhHoc" },
        ]
      },
    ]
  });
};
