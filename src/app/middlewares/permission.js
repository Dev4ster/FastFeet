export default (req, res, next) => {
  if (!req.is_admin) {
    return res
      .status(401)
      .json({ error: ' user not authorized to this method' });
  }
  return next();
};
