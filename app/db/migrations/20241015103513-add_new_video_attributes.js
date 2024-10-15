'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Videos','isEncoded', {
      
      allowNull: false,
      primaryKey: false,
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
    
  });

  await queryInterface.addColumn('Videos','is_uploaded', {
      
    allowNull: false,
    primaryKey: false,
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
  
});
await queryInterface.addColumn('Videos','job_id', {
      
  allowNull: true,
  primaryKey: false,
  type: Sequelize.DataTypes.STRING,
});
await queryInterface.addColumn('Videos','encoding_status', {
      
  allowNull: true,
  primaryKey: false,
  type: Sequelize.DataTypes.STRING

});
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
