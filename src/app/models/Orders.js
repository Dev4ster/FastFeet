import Sequelize, { Model } from 'sequelize';
import { parseISO } from 'date-fns';

class Orders extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      { sequelize, tableName: 'orders' }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });

    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });

    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });

    this.hasMany(models.DeliveryProblems, {
      foreignKey: 'delivery_id',
      as: 'problems',
    });
  }

  async cancelOrder({ canceled_at }) {
    const res = await this.update(parseISO(canceled_at));
    return res;
  }
}

export default Orders;
