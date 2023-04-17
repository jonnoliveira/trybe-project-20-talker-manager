const express = require('express');
const talkersDB = require('./db/talkersDB');
const { readData, findInData, writeData } = require('./utils/fsUtil');
const { createHash } = require('./utils/randomToken');
const { validationEmail, validationPassword, headerValidation, nameValidation,
  ageValidation, talkValidation, rateValidation,
  queryValidation, queryRateValidation, queryQAndNoRate,
  queryRateAndNoQ, queryDateValidation, queryDate, queryDateAndRate,
  queryDateAndQ, queryRateAndQ, noRate, hasRate } = require('./utils/middlewares');
 
const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const CREAT_OK = 201;
const HTTP_OK_DELETE = 204;
const HTTP_NOT_FOUND = 404;
const HTTP_SERVER_ERROR = 500;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar <<
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// ENDPOINTS
app.get('/talker', async (_req, res) => {
  const talkers = await readData();
  return res.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/db', async (_req, res) => {
  try {
    const [response] = await talkersDB.findAll();
    const result = response
      .map(({ name, age, id, talk_watched_at: watchedAt, talk_rate: rate }) => (
      {
        name, age, id, talk: { watchedAt, rate },
      }
    ));
    res.status(HTTP_OK_STATUS).json(result);
  } catch (error) {
    console.log(error);
    res.status(HTTP_SERVER_ERROR).json({ message: error.sqlMessage });
  }
});

app.get('/talker/search', headerValidation, queryValidation, queryRateValidation,
queryDateAndQ, queryQAndNoRate, queryRateAndNoQ, queryRateAndQ,
queryDateValidation, queryDate, queryDateAndRate,
async (req, res) => {
  const { q, rate, date } = req.query;
  const talkers = await readData();
  if (q && rate && date) {
    console.log('queryQAndRateAndDate');
    const findTalkers = talkers.filter((t) => (t.talk.watchedAt === date 
      && t.name.toLowerCase().includes((q).toLowerCase())
      && t.talk.rate === Number(rate)));
    if (findTalkers) return res.status(HTTP_OK_STATUS).json(findTalkers);
  }
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await findInData(id);
  if (talker) {
    return res.status(HTTP_OK_STATUS).json(talker);
  } 
    return res.status(HTTP_NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', validationEmail, validationPassword, async (_req, res) => {
  const token = createHash();
  return res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker', headerValidation, nameValidation, ageValidation,
talkValidation, rateValidation, async (req, res) => {
  const { name, age, talk } = req.body;
  const talkers = await readData();
  const id = talkers.length + 1;
  const newTalker = {
    name,
    age,
    id,
    talk,
  };

  talkers.push(newTalker);
  writeData(talkers);
  res.status(CREAT_OK).json(newTalker);
});

app.put('/talker/:id', headerValidation, nameValidation, ageValidation,
talkValidation, rateValidation, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talkers = await readData();
  const newTalker = talkers.find((t) => t.id === Number(id));

  if (!newTalker) {
  return res.status(HTTP_NOT_FOUND)
    .json({ message: 'Pessoa palestrante não encontrada' }); 
  }

  newTalker.name = name;
  newTalker.age = age;
  newTalker.talk = talk;
  writeData(talkers);
  return res.status(HTTP_OK_STATUS).json(newTalker);
});

app.delete('/talker/:id', headerValidation, async (req, res) => {
  const { id } = req.params;
  const talkers = await readData();
  const talker = talkers.find((talk) => talk.id === Number(id));
  if (talker) {
    const index = talkers.indexOf(talker);
    talkers.splice(index, 1);
    writeData(talkers);
    return res.status(HTTP_OK_DELETE).json();
  }
});

app.patch('/talker/rate/:id', headerValidation, noRate, hasRate, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;
  const talkers = await readData();
  const newTalker = talkers.find((t) => t.id === Number(id));
  if (!newTalker) {
  return res.status(HTTP_NOT_FOUND)
    .json({ message: 'Pessoa palestrante não encontrada' }); 
  }

  newTalker.talk.rate = rate;
  writeData(talkers);
  return res.status(HTTP_OK_DELETE).json();
});