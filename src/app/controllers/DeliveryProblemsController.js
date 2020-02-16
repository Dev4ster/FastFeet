import { Op } from 'sequelize';
import Orders from '../models/Orders';
import DeliveryProblems from '../models/DeliveryProblems';
import Deliveryman from '../models/Deliveryman';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail ';

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
    // preciso validar se essa ordem pertence ao deliveryman
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

  async index(req, res) {
    const orders = await Orders.findAll({
      where: {
        end_date: null,
      },
      include: [
        {
          model: DeliveryProblems,
          as: 'problems',
          where: {
            delivery_id: { [Op.col]: 'Orders.id' },
          },
        },
      ],
    });
    return res.json(orders);
  }

  async update(req, res) {
    const {
      params: { id },
    } = req;

    const order = await Orders.findOne({
      include: [
        {
          model: DeliveryProblems,
          as: 'problems',
          where: { id },
        },
        { model: Deliveryman, as: 'deliveryman' },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'order not found ' });
    }

    await order.update({
      canceled_at: new Date(),
    });

    await Queue.add(CancellationMail.key, {
      order,
    });

    return res.json(order);
  }
}

export default new DeliveryProblemsController();
