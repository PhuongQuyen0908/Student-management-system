import sequelize from "sequelize";
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('namhoc', {
    MaNam: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NamHoc: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'namhoc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaNam" },
        ]
      },
    ]
  });
};