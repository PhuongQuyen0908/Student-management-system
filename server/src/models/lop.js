import sequelize from "sequelize";
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lop', {
    MaLop: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenLop: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MaKhoi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'khoi',
        key: 'MaKhoi'
      }
    },
  }, {
    sequelize,
    tableName: 'lop',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaLop" },
        ]
      },
      {
        name: "fk_lop_khoi",
        using: "BTREE",
        fields: [
          { name: "MaKhoi" },
        ]
      },
    ]
  });
};