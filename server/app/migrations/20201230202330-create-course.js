'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Courses', {
      course_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      faculty_name: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Faculties',
          key: 'name',
          as: 'faculty_name',
        },
      },
      faculty_member_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Faculty_Members',
          key: 'id',
          as: 'faculty_member_id',
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      credit_hours: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Courses');
  }
};