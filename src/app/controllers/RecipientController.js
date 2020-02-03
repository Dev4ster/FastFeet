import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const recipient = await Recipient.create({
      id_recepient: 1,
      street: 'rua toninhas',
      number: '451',
      state: 'SP',
      city: 'São Paulo',
      zip_code: '04691040',
    });
    res.json(recipient);
  }
}

export default new RecipientController();
