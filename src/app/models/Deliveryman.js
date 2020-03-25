import { Sequelize, Model } from 'sequelize';

class Deliveryman extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.INTEGER,
        deliveryman_letters: {
          type: Sequelize.VIRTUAL,
          get() {
            const [first, second] = this.name.split(' ');
            return first.split('')[0] + second.split('')[0];
          },
        },
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
