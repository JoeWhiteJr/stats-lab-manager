const db = require('../config/database');

module.exports = async () => {
  await db.pool.end();
};
