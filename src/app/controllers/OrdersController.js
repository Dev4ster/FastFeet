import Orders from '../models/Orders';

class OrdersController {
  async store(req, res) {
    try {
      const order = await Orders.create({
        product: 'produto',
        recipient_id: 1,
        signature_id: 1,
        deliveryman_id: 2,
      });
      return res.json(order);
    } catch (e) {
      console.log(e);
    }

    return res.json(1);
  }
}
export default new OrdersController();
