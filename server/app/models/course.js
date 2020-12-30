'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Course.init({
    course_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    faculty_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    faculty_member_id: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    credit_hours: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  Course.associate = (models) => {
    // define association here
    Course.hasMany(models.Course_Student, {
      foreignKey: 'course_code'
    });
    Course.belongsTo(models.Faculty, {
      foreignKey: 'faculty_name'
    });
    Course.belongsTo(models.Faculty_Member, {
      foreignKey: 'faculty_member_id'
    });
  };
  return Course;
};