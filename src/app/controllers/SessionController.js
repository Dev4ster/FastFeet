import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';
// jaikinho
class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'password does not match' });
    }

    const { id, name, is_admin } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        is_admin,
      },
      token: jwt.sign({ id, is_admin }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
