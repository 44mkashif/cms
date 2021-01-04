'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Enrollment.init({
    reg_no: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING
    },
    academic_year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_enrolled: {
      type: DataTypes.DATE,
      allowNull: false
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Enrollment',
  });
  Enrollment.associate = (models) => {
    // define association here
    Enrollment.belongsTo(models.Student, {
      foreignKey: 'reg_no'
    });
    Enrollment.belongsTo(models.Section, {
      foreignKey: 'section_id',
      as: 'section'
    });
  };
  return Enrollment;
};