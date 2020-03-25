import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .nullable(),
      email: Yup.string()
        .email()
        .nullable(),
      id_avatar: Yup.number(),
    });
    /** *
     *  validade req shape
     */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { email, id_avatar } = req.body;
    /**
     * Check if email is already in use
     */
    const DeliverymanExists = await Deliveryman.findOne({
      where: { email },
    });
    if (DeliverymanExists) {
      return res
        .status(400)
        .json({ error: 'this email is already being used' });
    }
    /**
     * check if id_avatar existis case pased in req.body
     */

    if (id_avatar && !(await File.findByPk(id_avatar))) {
      return res
        .status(400)
        .json({ error: 'this id_avatar is not existis in database' });
    }
    /**
     * check if id_avatar is used per other user
     */

    if (id_avatar && (await Deliveryman.findOne({ where: { id_avatar } }))) {
      return res.status(400).json({ error: 'this avatar is already in use' });
    }
    const deliveryman = await Deliveryman.create(req.body);
    return res.json(deliveryman);
  }

  async index(req, res) {
    const { name } = req.query;
    const nameFilter = name ? { name: { [Op.ilike]: `%${name}%` } } : {};
    const filter = Object.assign(nameFilter);
    const deliverymans = await Deliveryman.findAll({
      include: [
        { model: File, as: 'avatar', attributes: ['id', 'url', 'path'] },
      ],
      attributes: ['id', 'name', 'email'],
      where: filter,
    });
    return res.json(deliverymans);
  }

  async update(req, res) {
    const {
      params: { id },
      body: { id_avatar, email },
    } = req;

    const schema = Yup.object().shape({
      name: Yup.string().nullable(),
      email: Yup.string().nullable(),
      id_avatar: Yup.number(),
    });
    /** *
     *  validade req shape
     */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    if (!id) {
      return res.status(400).json({ error: 'id not match in request params ' });
    }

    const deliveryman = await Deliveryman.findByPk(id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'deliveryman not found' });
    }

    /**
     * Check if email is already in use
     */

    if (
      email &&
      email !== deliveryman.email &&
      (await Deliveryman.findOne({
        where: { email },
      }))
    ) {
      return res
        .status(400)
        .json({ error: 'this email is already being used' });
    }
    /**
     * check if id_avatar existis case pased in req.body
     */

    if (id_avatar && !(await File.findByPk(id_avatar))) {
      return res
        .status(400)
        .json({ error: 'this id_avatar is not existis in database' });
    }
    /**
     * check if id_avatar is used per other user minus the user req
     */

    if (
      id_avatar &&
      (await Deliveryman.findOne({
        where: { id_avatar, id: { [Op.ne]: deliveryman.id } },
      }))
    ) {
      return res.status(400).json({ error: 'this avatar is already in use' });
    }

    const deliverymanUpdate = await deliveryman.update(req.body);

    return res.json(deliverymanUpdate);
  }

  async delete(req, res) {
    const { id } = req.params;
    const deliveryman = await Deliveryman.findByPk(id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }
    await deliveryman.destroy();
    return res.json({ deleted: true });
  }
}

export default new DeliverymanController();
