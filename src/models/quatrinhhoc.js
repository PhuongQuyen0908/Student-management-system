const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quatrinhhoc', {
    MaQTH: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaHS: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'hocsinh',
        key: 'MaHS'
      }
    },
    MaLop: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'lop',
        key: 'MaLop'
      }
    },
    MaHocKy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'hocky',
        key: 'MaHocKy'
      }
    },
    DiemTBHocKy: {
      type: DataTypes.DECIMAL(5,2),
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
          { name: "MaQTH" },
        ]
      },
      {
        name: "fk_qth_hocsinh",
        using: "BTREE",
        fields: [
          { name: "MaHS" },
        ]
      },
      {
        name: "fk_qth_lop",
        using: "BTREE",
        fields: [
          { name: "MaLop" },
        ]
      },
      {
        name: "fk_qth_hocky",
        using: "BTREE",
        fields: [
          { name: "MaHocKy" },
        ]
      },
    ]
  });
};
