import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import RecipientDetails from '../app/models/RecipientDetails';
import File from '../app/models/File';
import Deliveryman from '../app/models/Deliveryman';
import Orders from '../app/models/Orders';

const models = [User, Recipient, RecipientDetails, File, Deliveryman, Orders];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
