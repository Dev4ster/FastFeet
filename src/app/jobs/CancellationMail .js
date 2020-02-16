import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { order } = data;
    console.log('a fila executou');
    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancelation',
      context: {
        deliveryman: order.deliveryman.name,
        motivo: order.problems[0].description,
        date: format(
          parseISO(order.canceled_at),
          "'dia', dd 'de' MMMM', ás 'H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
