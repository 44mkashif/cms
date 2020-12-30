'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Course_Students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reg_no: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Students',
          key: 'reg_no'
        },
      },
      course_code: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: 'Courses',
          key: 'course_code'
        },
      },
      grade: {
        type: Sequelize.STRING
      },
      section: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Course_Students');
  }
};