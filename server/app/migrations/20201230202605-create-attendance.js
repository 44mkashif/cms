'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Attendances', {
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
      lecture_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('Attendances');
  }
};