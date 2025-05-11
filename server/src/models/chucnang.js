const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chucnang', {
    MaChucNang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TenChucNang: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    TenManHinhDuocLoad: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'chucnang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaChucNang" },
        ]
      },
    ]
  });
};
