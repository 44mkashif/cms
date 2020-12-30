'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course_Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Course_Student.init({
    course_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reg_no: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING
    },
    section: {
      type: DataTypes.STRING,
      defaultValue: 'A'
    }
  }, {
    sequelize,
    modelName: 'Course_Student',
  });
  Course_Student.associate = (models) => {
    // define association here
    Course_Student.belongsTo(models.Student, {
      foreignKey: 'reg_no'
    });
    Course_Student.belongsTo(models.Course, {
      foreignKey: 'course_code'
    });
  };
  return Course_Student;
};