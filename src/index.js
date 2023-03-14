const express = require('express');
const { readData } = require('./utils/fsUtil');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
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
