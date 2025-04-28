import sequelize from "sequelize";
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('monhoc', {
    MaMonHoc: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenMonHoc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    HeSo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'monhoc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaMonHoc" },
        ]
      },
    ]
  });
};