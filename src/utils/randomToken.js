const crypto = require('crypto');

const createHash = async () => crypto.randomBytes(8).toString('hex'); 

module.exports = {
  createHash,
};
