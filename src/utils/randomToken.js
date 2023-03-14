const crypto = require('crypto');

const createHash = () => crypto.randomBytes(8).toString('hex'); 

module.exports = {
  createHash,
};
