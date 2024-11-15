const knex = require('knex');
const config = require('./config');

const db = knex({
  client: 'mysql2',
  connection: config.database,
});

module.exports = db;
