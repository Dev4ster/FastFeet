export default (model, context) => {
  return new Promise((resolve, reject) => {
    model
      .destroy(context)
      .then(res => resolve(!!res))
      .catch(err => reject(err));
  });
};
// eu que fiz isso <3
