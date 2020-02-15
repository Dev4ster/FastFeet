module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      recipient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: { model: 'recipients', key: 'id' },
      },
      deliveryman_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: { model: 'deliverymans', key: 'id' },
      },
      signature_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        foreignKey: true,
        references: { model: 'files', key: 'id' },
      },
      product: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('orders');
  },
};
