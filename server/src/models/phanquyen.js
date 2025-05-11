const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('phanquyen', {
    MaNhom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'nhomnguoidung',
        key: 'MaNhom'
      }
    },
    MaChucNang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chucnang',
        key: 'MaChucNang'
      }
    }
  }, {
    sequelize,
    tableName: 'phanquyen',
    timestamps: false,
    indexes: [
      {
        name: "fk_pq_chucnang",
        using: "BTREE",
        fields: [
          { name: "MaChucNang" },
        ]
      },
      {
        name: "fk_pq_nh",
        using: "BTREE",
        fields: [
          { name: "MaNhom" },
        ]
      },
    ]
  });
};
