import sequelize from "sequelize";
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('khoi', {
    MaKhoi: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenKhoi: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'khoi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaKhoi" },
        ]
      }
    ]
  });
};