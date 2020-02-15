import Sequelize, { Model } from 'sequelize';

class DeliveryProblems extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      { sequelize }
    );
    this.removeAttribute('id');
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Orders, {
      key: 'delivery_id',
      targetKey: 'id',
      as: 'problems',
    });
  }
}

export default DeliveryProblems;
