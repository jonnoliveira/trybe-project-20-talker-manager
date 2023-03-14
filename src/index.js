const express = require('express');
const { readData, findInData } = require('./utils/fsUtil');
const { createHash } = require('./utils/randomToken');
const { validationEmail, validationPassword } = require('./utils/validations');
 
const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
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

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await findInData(id);
  if (talker) {
    return res.status(HTTP_OK_STATUS).json(talker);
  } 
    return res.status(HTTP_NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', validationEmail, validationPassword, async (req, res) => {
  const token = await createHash();
  return res.status(HTTP_OK_STATUS).json({ token });
});
