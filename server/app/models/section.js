'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Section.init({
    course_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    faculty_member_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_no: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Section',
  });
  Section.associate = (models) => {
    // define association here
    Section.belongsTo(models.Faculty_Member, {
      foreignKey: 'faculty_member_id'
    });
    Section.hasMany(models.Attendance, {
      foreignKey: 'section_id',
      as: 'attendances'
    });
    Section.hasMany(models.Enrollment, {
      foreignKey: 'section_id',
      as: 'enrollments'
    });
  };
  return Section;
};