import Sequelize from 'sequelize';
import Orders from '../models/Orders';
import DeliveryProblems from '../models/DeliveryProblems';

class DeliveryProblemsController {
  async store(req, res) {
    const {
      params: { id: delivery_id },
      body: { description },
    } = req;

    const order = await Orders.findByPk(delivery_id);

    if (!order) {
      return res.status(400).json({ error: 'order not found' });
    }
    if (!description) {
      return res.status(400).json({ error: 'description is required' });
    }
    const problem = await DeliveryProblems.create({
      delivery_id,
      ...req.body,
    });
    return res.json(problem);
  }

  async show(req, res) {
    const {
      params: { id: delivery_id },
    } = req;

    const order = await Orders.findOne({
      where: { id: delivery_id },
      include: [
        {
          model: DeliveryProblems,
          as: 'problems',
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'order not found' });
    }
    return res.json(order);
  }
}

export default new DeliveryProblemsController();
