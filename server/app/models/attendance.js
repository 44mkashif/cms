'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Attendance.init({
    reg_no: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      section_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      lecture_no: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  Attendance.associate = (models) => {
    // define association here
    Attendance.belongsTo(models.Student, {
      foreignKey: 'reg_no'
    });
    Attendance.belongsTo(models.Section, {
        foreignKey: 'section_id'
      });
  };
  return Attendance;
};