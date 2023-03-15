const { readData } = require('./fsUtil');

const HTTP_NOT_FOUND = 400;
const HTTP_CLIENT_AUTH = 401;
const HTTP_OK_STATUS = 200;

const validationEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(HTTP_NOT_FOUND).json({ message: 'O campo "email" é obrigatório' });
  }
  const emailPattern = (/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/);
  const validEmail = emailPattern.test(email);
  if (!validEmail) {
  return res.status(HTTP_NOT_FOUND)
    .json({ message: 'O "email" deve ter o formato "email@email.com"' }); 
  }
  next();
};

const validationPassword = async (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(HTTP_NOT_FOUND).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
  return res.status(HTTP_NOT_FOUND)
   .json({ message: 'O "password" deve ter pelo menos 6 caracteres' }); 
  }
  next();
};

const headerValidation = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(HTTP_CLIENT_AUTH).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16 || typeof authorization !== 'string') {
    return res.status(HTTP_CLIENT_AUTH).json({ message: 'Token inválido' });
  }
  next();
};

const nameValidation = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(HTTP_NOT_FOUND)
      .json({ message: 'O campo "name" é obrigatório' }); 
  }
  if (name.length < 3) {
  return res.status(HTTP_NOT_FOUND).json({ message: 'O "name" deve ter pelo menos 3 caracteres' }); 
  }
  next();
};

const ageValidation = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(HTTP_NOT_FOUND).json({ message: 'O campo "age" é obrigatório' }); 
  }
  if (!Number.isInteger(age) || age < 18) {
    return res.status(HTTP_NOT_FOUND)
    .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' }); 
  }
  next();
};

const talkValidation = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(HTTP_NOT_FOUND)
      .json({ message: 'O campo "talk" é obrigatório' }); 
  }
  if (!talk.watchedAt) {
    return res.status(HTTP_NOT_FOUND)
      .json({ message: 'O campo "watchedAt" é obrigatório' }); 
  }
  const patternData = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  if (!patternData.test(talk.watchedAt)) {
    return res.status(HTTP_NOT_FOUND)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const rateValidation = (req, res, next) => {
  const { talk } = req.body;
  if (talk.rate === undefined) {
    return res.status(HTTP_NOT_FOUND)
      .json({ message: 'O campo "rate" é obrigatório' }); 
  }
  if (!Number.isInteger(talk.rate) || Number(talk.rate) < 1 || Number(talk.rate) > 5) {
    return res.status(HTTP_NOT_FOUND)
    .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};

const queryValidation = async (req, res, next) => {
  const { q, rate, date } = req.query;
  const talkers = await readData();
  if (!q && !rate && !date) return res.status(HTTP_OK_STATUS).json(talkers);
  next();
};

const queryRateValidation = async (req, res, next) => {
  const { rate } = req.query;
  if (rate && (!Number.isInteger(+rate) || Number(rate) < 1 || Number(rate) > 5)) {
    return res.status(HTTP_NOT_FOUND)
    .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' }); 
  }
  next();
};

const queryQAndNoRate = async (req, res, next) => {
  const { q, rate } = req.query;
  const talkers = await readData();
    if (q && !rate) {
    const findTalkers = talkers.filter((talk) => talk.name.toLowerCase()
    .includes((q).toLowerCase()));
    if (!findTalkers) {
        return res.status(HTTP_OK_STATUS).json([]);
      }
      return res.status(HTTP_OK_STATUS).json(findTalkers);
  }
  next();
};

const queryRateAndNoQ = async (req, res, next) => {
  const { q, rate } = req.query;
  const talkers = await readData();
    if (!q && rate) {
    const findTalkers = talkers.filter((t) => t.talk.rate === Number(rate));
    if (!findTalkers) {
        return res.status(HTTP_OK_STATUS).json([]);
      }
      return res.status(HTTP_OK_STATUS).json(findTalkers);
  }
  next();
};

const queryDateValidation = async (req, res, next) => {
  const { date } = req.query;
  const talkers = await readData();
  const patternData = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  if (!patternData.test(date)) {
    return res.status(HTTP_NOT_FOUND)
      .json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
  } 
  const talker = talkers.filter((t) => t.talk.watchedAt === date);
  if (talker) return res.status(HTTP_OK_STATUS).json(talker);
  
  next();
};

const queryDateAndRate = async (req, res, next) => {
  const { date, rate } = req.query;
  const talkers = await readData();
  if (date && rate) {
    const findTalkers = talkers.filter((t) => (
      (t.talk.rate === Number(rate)) && (t.talk.watchedAt === date)));
    if (!findTalkers) {
        return res.status(HTTP_OK_STATUS).json([]);
      }
    return res.status(HTTP_OK_STATUS).json(findTalkers);
  }
  next();
};

const queryDateAndQ = async (req, res, next) => {
  const { date, q } = req.query;
  const talkers = await readData();
  if (date && q) {
    const findTalkers = talkers.filter((t) => (
      t.talk.watchedAt === date && t.name.toLowerCase()
      .includes((q).toLowerCase())));
    if (!findTalkers) {
        return res.status(HTTP_OK_STATUS).json([]);
      }
    return res.status(HTTP_OK_STATUS).json(findTalkers);
  }
  next();
};

module.exports = {
  validationEmail,
  validationPassword,
  headerValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  rateValidation,
  queryValidation,
  queryRateValidation,
  queryQAndNoRate,
  queryRateAndNoQ,
  queryDateValidation,
  queryDateAndRate,
  queryDateAndQ,
};
