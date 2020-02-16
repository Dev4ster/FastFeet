import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        id_recipient_details: Sequelize.INTEGER,
        street: Sequelize.STRING,
        number: Sequelize.STRING,
        complement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        zip_code: Sequelize.STRING,
        address: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${this.street} ${this.number} - ${this.city}, ${this.state} - ${this.zip_code}`;
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
    this.belongsTo(models.RecipientDetails, {
      foreignKey: 'id_recipient_details',
      as: 'detail',
    });
  }
}

export default Recipient;
