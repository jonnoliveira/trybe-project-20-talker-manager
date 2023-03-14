const fs = require('fs').promises;
const path = require('path');

const JSON_DATA = '../talker.json';

const readData = async () => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, JSON_DATA));
    const talkers = JSON.parse(data);
    return talkers;
  } catch (error) {
    return console.log(`Erro em readData: ${error}`);
  }
};

const findInData = async (id) => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, JSON_DATA));
    const talker = JSON.parse(data).find((talk) => talk.id === Number(id));
    return talker;
  } catch (error) {
    return console.log(`Erro no findInData: ${error}`);
  }
};

const writeData = async (newData) => {
  try {
    const stringfy = JSON.stringify(newData);
    return fs.writeFile(path.resolve(__dirname, JSON_DATA), stringfy);
  } catch (error) {
    return console.log(`Erro no writeData: ${error}`);
  }
};

module.exports = {
  readData,
  findInData,
  writeData,
};