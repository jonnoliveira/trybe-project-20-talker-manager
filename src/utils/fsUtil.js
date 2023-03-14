const fs = require('fs').promises;
const path = require('path');

const JSON_DATA = '../talker.json';

const readData = async () => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, JSON_DATA));
    const talkers = JSON.parse(data);
    return talkers;
  } catch (error) {
    return console.log(`Erro na leitura: ${error}`);
  }
};

module.exports = {
  readData,
};