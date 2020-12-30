'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Faculties', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      location: {
        type: Sequelize.STRING
      },
      dean_id: {
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
    await queryInterface.dropTable('Faculties');
  }
};