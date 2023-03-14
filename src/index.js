const express = require('express');
const { readData, findInData, writeData } = require('./utils/fsUtil');
const { createHash } = require('./utils/randomToken');
const { validationEmail, validationPassword, headerValidation, nameValidation,
  ageValidation, talkValidation, rateValidation } = require('./utils/validations');
 
const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const CREAT_OK = 201;
const HTTP_OK_DELETE = 204;
const HTTP_NOT_FOUND = 404;
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

app.get('/talker/search', headerValidation, async (req, res) => {
  const { query } = req;
  const talkers = await readData();
  if (!query) return res.status(HTTP_OK_STATUS).json(talkers);

  const findTalkers = talkers.filter((talk) => talk.name.toLowerCase()
    .includes((query.q).toLowerCase()));
   
  if (!findTalkers) {
      return res.status(HTTP_OK_STATUS).json([]);
    }
  return res.status(HTTP_OK_STATUS).json(findTalkers);
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
  const talkers = await readData();
  const newTalker = {
    id: talkers.length + 1,
    ...req.body,
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