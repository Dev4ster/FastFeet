import Sequelize, { Model } from 'sequelize';

class RecipientDetails extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        telephone: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default RecipientDetails;
