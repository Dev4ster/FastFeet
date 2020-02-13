import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import RecipientDetails from '../models/RecipientDetails';
import SequelizeDeletePromise from '../utils/SequelizeDeletePromise';

class RecipientController {
  async index(req, res) {
    // Recipient.belongsTo(RecipientDetails, {
    //   foreignKey: 'id_recipient_details',
    //   sourceKey: 'id',
    // });
    // RecipientDetails.hasMany(Recipient, {
    //   foreignKey: 'id_recipient_details',
    // });

    const allRecipients = await Recipient.findAll({
      order: [['created_at', 'DESC']],
      include: [{ model: RecipientDetails, as: 'detail' }],
    });
    return res.json(allRecipients);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_details: Yup.object().shape({
        recipient: Yup.object().shape({
          id: Yup.number(),
          name: Yup.string().when('id', (id, field) =>
            id ? field : field.required().nullable()
          ),
          email: Yup.string()
            .email()
            .when('id', (id, field) =>
              id ? field : field.required().nullable()
            ),
          telephone: Yup.string()
            .when('id', (id, field) =>
              id ? field : field.required().nullable()
            )
            .min(10),
        }),
      }),
      street: Yup.string()
        .required()
        .nullable(),
      number: Yup.string()
        .required()
        .nullable(),
      state: Yup.string()
        .required()
        .max(2)
        .min(2)
        .nullable(),
      city: Yup.string()
        .required()
        .nullable(),
      zip_code: Yup.string()
        .required()
        .min(8)
        .max(8)
        .nullable(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const {
      recipient_details: {
        recipient: { id, name, email, telephone },
      },
      street,
      number,
      state,
      city,
      zip_code,
    } = req.body;

    // aqui eu verifico se ele ta mandando id e mais aluma coisa
    if (id && name) {
      return res.status(400).json({
        error: `many parameters in recipient object remove id or other parameters`,
      });
    }
    // processamento se ele enviar o id
    if (id) {
      try {
        const recipientExists = await RecipientDetails.findByPk(id);
        if (!recipientExists) {
          return res
            .status(400)
            .json({ error: `recipient not found with id: ${id}` });
        }

        const recipient = await Recipient.create({
          id_recipient_details: id,
          street,
          number,
          state,
          city,
          zip_code,
        });
        return res.json(recipient);
      } catch (e) {
        return res.json({ e });
      }
    }

    // processamento se ele estiver criando um novo recipient_details
    if (name && email && telephone) {
      try {
        const recipient_detailsExists = await RecipientDetails.findOne({
          where: {
            email,
          },
        });
        // veririfco se o recipient_details já existe
        if (recipient_detailsExists) {
          return res.status(400).json({
            error: `this recipient details is already exists: ${recipient_detailsExists.id}`,
          });
        }
        // cria um novo recipient_details
        const new_recipient_details = await RecipientDetails.create({
          name,
          email,
          telephone,
        });
        // cria um recipient e atribui o recipient_details criado anteriormente a ele
        if (new_recipient_details) {
          const new_recipient = await Recipient.create({
            id_recipient_details: new_recipient_details.id,
            street,
            number,
            state,
            city,
            zip_code,
          });
          return res.json(new_recipient);
        }
      } catch (e) {
        return res.json({ e });
      }
    }
    return res.json('ok');
  }

  async update(req, res) {
    const {
      params: { id },
      body: {
        recipient_details: {
          recipient: { id: id_detail, name, email, telephone },
        },
      },
    } = req;

    try {
      const currentRecipient = await Recipient.findByPk(id);
      if (currentRecipient) {
        if (id_detail && id_detail !== currentRecipient.id_recipient_details) {
          const recipientDetailsExists = await RecipientDetails.findByPk(
            id_detail
          );
          if (!recipientDetailsExists) {
            return res.status(400).json({
              error: `recipient details not found with id: ${id_detail}`,
            });
          }
          req.body.id_recipient_details = id_detail;
        } else if (name && email && telephone) {
          const recipient_detailsExists = await RecipientDetails.findOne({
            where: {
              email,
            },
          });
          // veririfco se o recipient_details já existe
          if (recipient_detailsExists) {
            return res.status(400).json({
              error: `this recipient details is already exists: ${recipient_detailsExists.id}`,
            });
          }
          const new_recipient_details = await RecipientDetails.create({
            name,
            email,
            telephone,
          });
          req.body.id_recipient_details = new_recipient_details.id;
        }
      }
      currentRecipient.update(req.body);
      return res.json(currentRecipient);
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      const deleted = await SequelizeDeletePromise(Recipient, {
        where: { id },
      });
      return res.json({ current: `recipient id ${id}`, deleted });
    } catch (e) {
      return res.status(500).json({
        error: 'you cannot delete data that is being used by another table',
        error_trace: (e.original.detail || e.parent.detail).replace(
          /[\\"]/g,
          ''
        ),
      });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id, {
      include: [{ model: RecipientDetails, as: 'detail' }],
    });
    return res.json(recipient);
  }
}

export default new RecipientController();
