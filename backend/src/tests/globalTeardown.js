const db = require('../config/database');
const { server } = require('../index');

module.exports = async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
  await db.pool.end();
};
