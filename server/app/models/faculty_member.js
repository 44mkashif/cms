'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Faculty_Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Faculty_Member.init({
    faculty_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Faculty_Member',
  });
  Faculty_Member.associate = (models) => {
    // define association here
    Faculty_Member.belongsTo(models.Faculty, {
      foreignKey: 'faculty_name'
    });
    Faculty_Member.hasMany(models.Course, {
      foreignKey: 'faculty_member_id'
    });
  };
  return Faculty_Member;
};