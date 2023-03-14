const HTTP_NOT_FOUND = 400;

const validationEmail = async (req, res, next) => {
  if (!req.body.email) {
    return res.status(HTTP_NOT_FOUND).json({ message: 'O campo "email" é obrigatório' });
  }
  const emailPattern = (/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/);
  const validEmail = emailPattern.test(req.body.email);
  if (!validEmail) {
  return res.status(HTTP_NOT_FOUND)
    .json({ message: 'O "email" deve ter o formato "email@email.com"' }); 
  }
  next();
};

const validationPassword = async (req, res, next) => {
  if (!req.body.password) {
    return res.status(HTTP_NOT_FOUND).json({ message: 'O campo "password" é obrigatório' });
  }
  if (req.body.password.length < 6) {
  return res.status(HTTP_NOT_FOUND)
   .json({ message: 'O "password" deve ter pelo menos 6 caracteres' }); 
  }
  next();
};

module.exports = {
  validationEmail,
  validationPassword,
};
