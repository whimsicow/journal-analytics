require('dotenv').config();
const pg_promise = require('pg-promise');
const pg = pg_promise();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS
};

module.exports = pg(dbConfig);