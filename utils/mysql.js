require('dotenv').config();
const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');

const options = {
  connectionLimit: 5, //important
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  debug: false
};

const pool = mysql.createPool(options);

// let databaseReady = false;

pool.query('SHOW DATABASES', (err, data) => {
  if (err) {
    console.error(err);

    return;
  }

  console.log('MYSQL ready');

  databaseReady = true;
});

exports.poolConnection = (host, user, password, database, limit = 3) => {
  return mysql.createPool({
    connectionLimit: limit, //important
    host,
    user,
    password,
    database,
    debug: false
  });
};

exports.query = (db, query) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, data) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      return resolve(data);
    });
  });
};

exports.poolQuery = query => {
  return new Promise((resolve, reject) => {
    pool.query(query, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
};

exports.singleQuery = (host, user, password, database, query) => {
  return new Promise(async (resolve, reject) => {
    const connection = await mysqlPromise.createConnection({
      host,
      user,
      database,
      password
    });

    const [rows, fields] = await connection.execute(query);

    return resolve(rows);
  });
};

exports.escape = string => mysql.escape(string);
