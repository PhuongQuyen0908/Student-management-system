const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('thamso', {
    TuoiToiThieu: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TuoiToiDa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DiemCuaMon: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    SiSoToiDa: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'thamso',
    timestamps: false
  });
};
