'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Result.init({
    reg_no: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gpa: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    scholistic_status: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Result',
  });
  Result.associate = (models) => {
    // define association here
    Result.belongsTo(models.Student, {
      foreignKey: 'reg_no'
    });
  };
  return Result;
};