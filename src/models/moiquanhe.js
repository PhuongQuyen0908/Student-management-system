const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('moiquanhe', {
    MaPHHS: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'phuhuynhhs',
        key: 'MaPHHS'
      }
    },
    MaHS: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'hocsinh',
        key: 'MaHS'
      }
    },
    TenQuanHe: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'moiquanhe',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPHHS" },
          { name: "MaHS" },
        ]
      },
      {
        name: "fk_mqh_hocsinh",
        using: "BTREE",
        fields: [
          { name: "MaHS" },
        ]
      },
    ]
  });
};
