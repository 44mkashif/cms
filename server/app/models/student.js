'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Student.init({
    reg_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 1024]
      }
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    batch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING
    },
    faculty_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING
    },
    cgpa: {
      type: DataTypes.FLOAT
    }
  }, {
    sequelize,
    modelName: 'Student',
  });
  Student.associate = (models) => {
    // define association here
    Student.belongsTo(models.Faculty, {
      foreignKey: 'faculty_name',
      as: 'students'
    });
    Student.hasMany(models.Attendance, {
      foreignKey: 'reg_no'
    });
    Student.hasMany(models.Result, {
      foreignKey: 'reg_no'
    });
    Student.hasMany(models.Enrollment, {
      foreignKey: 'reg_no'
    });
  };
  return Student;
};