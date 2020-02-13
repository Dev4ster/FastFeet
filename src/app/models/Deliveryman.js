import { Sequelize, Model } from 'sequelize';

class Deliveryman extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'id_avatar',
      as: 'avatar',
    });
  }
}

export default Deliveryman;
