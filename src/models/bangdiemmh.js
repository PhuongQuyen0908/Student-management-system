const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bangdiemmh', {
    MaBangDiemMH: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MaMH: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'monhoc',
        key: 'MaMH'
      }
    },
    MaQTH: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'quatrinhhoc',
        key: 'MaQTH'
      }
    },
    DiemTBMH: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'bangdiemmh',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaBangDiemMH" },
        ]
      },
      {
        name: "fk_mh_bdmh",
        using: "BTREE",
        fields: [
          { name: "MaMH" },
        ]
      },
      {
        name: "fk_bdmn_qtrhoc",
        using: "BTREE",
        fields: [
          { name: "MaQTH" },
        ]
      },
    ]
  });
};
