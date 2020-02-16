import Mail from '../../lib/mail';

class OrderNewMail {
  get key() {
    return 'OrderNewMail';
  }

  async handle({ data }) {
    const { order } = data;
    console.log('a fila executou');
    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Nova entrega disponivel',
      template: 'ordersNew',
      context: {
        deliveryman: order.deliveryman.name,
        product: order.product,
        address: order.recipient.address,
      },
    });
  }
}

export default new OrderNewMail();
