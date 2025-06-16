const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Lop = sequelize.define('lop', {
    MaLop: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenLop: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    MaKhoi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'khoi',
        key: 'MaKhoi'
      }
    }
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
  Lop.associate = function(models) {
    Lop.belongsTo(models.khoi, { foreignKey: 'MaKhoi', as: 'khoi' });
  };
  return Lop;
};
