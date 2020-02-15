import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  parseISO,
  isBefore,
  subMinutes,
  addMinutes,
  isAfter,
} from 'date-fns';
import File from '../models/File';
import Orders from '../models/Orders';
import Deliveryman from '../models/Deliveryman';

class DeliveryController {
  async index(req, res) {
    const {
      params: { id },
      query: { hand, canceled, initiates },
    } = req;

    const { id: deliveryman_id } = await Deliveryman.findByPk(id);

    if (!deliveryman_id) {
      return res.status(400).json({ error: 'deliveryman not found ' });
    }

    const addtionals = {
      end_date: null,
      canceled_at: null,
      start_date: null,
    };
    if (hand && (hand === 'true') === true) {
      addtionals.end_date = {
        [Op.ne]: null,
      };
    }
    if (canceled && (canceled === 'true') === true) {
      addtionals.canceled_at = {
        [Op.ne]: null,
      };
    }
    if (initiates && (initiates === 'true') === true) {
      addtionals.start_date = {
        [Op.ne]: null,
      };
    }

    const where = {
      deliveryman_id,
      ...addtionals,
    };

    const oders = await Orders.findAll({
      where,
    });

    return res.json(oders);
  }

  async update(req, res) {
    const {
      params: { id: deliveryman_id, id_order },
      body: { start_date, end_date, signature_id },
    } = req;

    if (start_date && end_date) {
      return res.status(401).json({
        error: 'you cannot start and finish a delivery at the same time',
      });
    }

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);
    /**
     * check if deliveryman exisists
     */
    if (!deliveryman) {
      return res.status(400).json({ error: 'deliveryman not found' });
    }

    /**
     * check if order exisists
     */

    const order = await Orders.findByPk(id_order);

    if (!order) {
      return res.status(400).json({ error: 'order not found' });
    }
    /**
     * check if deliveryman id is equal oder.deliveryman_id
     */

    if (order.deliveryman_id !== deliveryman.id) {
      return res
        .status(401)
        .json({ error: 'oder not associed with deliveryman id' });
    }
    /**
     * check if order is already started
     */
    if (order.start_date !== null && start_date) {
      return res
        .status(400)
        .json({ error: 'this order will not be initiated twice' });
    }

    /**
     * check if order is already finnaly
     */
    if (order.end_date !== null && end_date) {
      return res
        .status(400)
        .json({ error: 'this order will not be finished twice' });
    }

    const WithdrawalsCount = await Orders.findAndCountAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
      },
    });

    if (start_date && WithdrawalsCount.count === 5) {
      return res
        .status(401)
        .json({ error: 'the limit of start withdrawals reached' });
    }

    // return res.json(isBefore(parseISO(start_date), subMinutes(new Date(), 10)));
    const data = {};

    /**
     * check if start_data exists in req body and convert string to date is equal a true
     */
    if (start_date && parseISO(start_date)) {
      data.start_date = parseISO(start_date);
    }
    /**
     * check if end_date exists in req body and convert string to date is equal a true
     */
    if (end_date && !signature_id) {
      return res
        .status(400)
        .json({ error: 'the signature_id is required to end order' });
    }
    if (end_date && parseISO(end_date)) {
      data.end_date = parseISO(end_date);
      data.signature_id = signature_id;
    }

    //* check if start_date it is in range of 10 minutes into request date and date now
    if (
      data.start_date &&
      isBefore(data.start_date, subMinutes(new Date(), 10))
    ) {
      return res.status(400).json({
        error: `the start date cannot be less than ${subMinutes(
          new Date(),
          10
        )}`,
      });
    }
    if (
      data.start_date &&
      isAfter(data.start_date, addMinutes(new Date(), 10))
    ) {
      return res.status(400).json({
        error: `the start date cannot be more than ${addMinutes(
          new Date(),
          10
        )}`,
      });
    }
    //* check if end_date it is in range of 10 minutes into request date and date now
    if (data.end_date && isBefore(data.end_date, subMinutes(new Date(), 10))) {
      return res.status(400).json({
        error: `the end date cannot be less than ${subMinutes(new Date(), 10)}`,
      });
    }
    if (data.end_date && isAfter(data.end_date, addMinutes(new Date(), 10))) {
      return res.status(400).json({
        error: `the end date cannot be more than ${addMinutes(new Date(), 10)}`,
      });
    }

    /**
     * signature
     */

    /**
     * check if signature id exisits
     */

    if (
      data.end_date &&
      data.signature_id &&
      !(await File.findByPk(signature_id))
    ) {
      return res.status(400).json({ error: 'signature not found' });
    }

    if (
      data.end_date &&
      data.signature_id &&
      (await Orders.findOne({ where: { signature_id: data.signature_id } }))
    ) {
      return res
        .status(400)
        .json({ error: 'signature is already used per other order' });
    }

    order.update({
      ...data,
    });

    return res.json(order);
  }
}
export default new DeliveryController();
