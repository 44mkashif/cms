'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Faculty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Faculty.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    location: {
      type: DataTypes.STRING
    },
    dean_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Faculty',
  });
  Faculty.associate = (models) => {
    // define association here
    Faculty.hasMany(models.Student, {
      foreignKey: 'faculty_name',
      as: 'students'
    });
    Faculty.hasMany(models.Course, {
      foreignKey: 'faculty_name',
      as: 'courses'
    });
    Faculty.hasMany(models.Faculty_Member, {
      foreignKey: 'faculty_name',
      as: 'faculty_members'
    });
    // Faculty.hasOne(models.Faculty_Member, {
    //   foreignKey: 'dean_id',
    //   as: 'dean'
    // })
  };
  return Faculty;
};