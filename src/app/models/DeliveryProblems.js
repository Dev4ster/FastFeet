import Sequelize, { Model } from 'sequelize';

class DeliveryProblems extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      { sequelize, tableName: 'delivery_problems' }
    );

    return this;
  }

  static associate(models) {
    // this.belongsTo(models.Orders, {
    //   foreignKey: 'delivery_id',
    //   as: 'problems',
    // });
  }
}

export default DeliveryProblems;
