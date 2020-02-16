import * as Yup from 'yup';
import Orders from '../models/Orders';
import Recipient from '../models/Recipient';
import RecipientDetails from '../models/RecipientDetails';
import File from '../models/File';
import Deliveryman from '../models/Deliveryman';
import Queue from '../../lib/Queue';
import OrderNewMail from '../jobs/OrderNewMail';

class OrdersController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string()
        .required()
        .nullable(),
      recipient_id: Yup.number()
        .required()
        .nullable(),
      deliveryman_id: Yup.number()
        .required()
        .nullable(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: ' validation fails ' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    /**
     * check if recipient id exisits
     */

    if (!(await Recipient.findByPk(recipient_id))) {
      return res.status(400).json({ error: ' recipient not found' });
    }

    /**
     * check if delivery man exisits
     */

    if (!(await Deliveryman.findByPk(deliveryman_id))) {
      return res.status(400).json({ error: 'deliveryman not found' });
    }

    const orderNew = await Orders.create(req.body);

    const order = await Orders.findOne({
      where: { id: orderNew.id },
      include: [
        { model: Recipient, as: 'recipient' },
        { model: Deliveryman, as: 'deliveryman' },
      ],
    });

    await Queue.add(OrderNewMail.key, {
      order,
    });

    return res.json(order);
  }

  async update(req, res) {
    const {
      params: { id },
      body: { product, recipient_id, signature_id, deliveryman_id },
    } = req;

    const order = await Orders.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'order not found' });
    }

    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      signature_id: Yup.number(),
      deliveryman_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    /**
     * check if recipient id exisits
     */

    if (recipient_id && !(await Recipient.findByPk(recipient_id))) {
      return res.status(400).json({ error: ' recipient not found' });
    }

    /**
     * check if signature id exisits
     */

    if (signature_id && !(await File.findByPk(signature_id))) {
      return res.status(400).json({ error: 'signature not found' });
    }

    /**
     * check if delivery man exisits
     */

    if (deliveryman_id && !(await Deliveryman.findByPk(deliveryman_id))) {
      return res.status(400).json({ error: 'deliveryman not found' });
    }

    order.update({
      product,
      recipient_id,
      signature_id,
      deliveryman_id,
    });
    return res.json(order);
  }

  async index(req, res) {
    const allOrders = await Orders.findAll({
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          include: [
            {
              model: RecipientDetails,
              as: 'detail',
              attributes: ['id', 'name', 'email', 'telephone'],
            },
          ],
          attributes: [
            'id',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        { model: File, as: 'signature', attributes: ['id', 'url', 'path'] },
      ],
    });
    return res.json(allOrders);
  }

  async delete(req, res) {
    const order = await Orders.findByPk(req.params.id);
    if (!order) {
      return res.status(400).json({ error: 'order not found ' });
    }
    await order.destroy();
    return res.json({ deltede: true });
  }
}
export default new OrdersController();
