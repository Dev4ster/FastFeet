import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import RecipientDetails from '../app/models/RecipientDetails';

const models = [User, Recipient, RecipientDetails];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
