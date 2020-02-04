import * as YUP from 'yup';
import RecipientDetails from '../models/RecipientDetails';
import SequelizeDeletePromise from '../utils/SequelizeDeletePromise';

class RecipientDetailsController {
  async index(req, res) {
    const allDetails = await RecipientDetails.findAll();
    return res.json(allDetails);
  }

  async store(req, res) {
    const schema = YUP.object().shape({
      name: YUP.string().required(),
      email: YUP.string()
        .required()
        .email(),
      telephone: YUP.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validadition fails' });
    }
    const { name, email, telephone } = req.body;
    const recipientExist = await RecipientDetails.findOne({ where: { email } });
    if (recipientExist) {
      return res.status(400).json({
        error: `this recipient details already existis but id:${recipientExist.id}`,
      });
    }
    const recipientDetailsCreate = await RecipientDetails.create({
      name,
      email,
      telephone,
    });
    return res.json(recipientDetailsCreate);
  }

  async update(req, res) {
    const schema = YUP.object().shape({
      name: YUP.string(),
      email: YUP.string().email(),
      telephone: YUP.string(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validadition fails' });
    }

    const {
      params: { id },
      body: { email },
    } = req;

    const currentDetail = await RecipientDetails.findByPk(id);
    const recipientExist = await RecipientDetails.findOne({ where: { email } });
    if (recipientExist) {
      return res.status(400).json({
        error: `this email already existis in recipient details id:${recipientExist.id}`,
      });
    }
    const response = await currentDetail.update(req.body);
    return res.json(response);
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      const deleted = await SequelizeDeletePromise(RecipientDetails, {
        where: { id },
      });
      return res.json({ current: `detail id ${id}`, deleted });
    } catch (e) {
      return res.status(500).json({
        error: 'you cannot delete data that is being used by another table',
        error_trace: (e.original.detail || e.parent.detail).replace(
          /[\\"]/g,
          ''
        ),
      });
    }

    // RecipientDetails.destroy({ where: { id } })
    //   .then(del => {
    //     console.log(del);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  async show(req, res) {
    const { id } = req.params;
    try {
      const recipientDetails = await RecipientDetails.findByPk(id);
      return res.json(recipientDetails);
    } catch (e) {
      return res.json(e);
    }
  }
}
export default new RecipientDetailsController();
