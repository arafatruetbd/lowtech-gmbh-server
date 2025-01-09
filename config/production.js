'use strict';

module.exports = {
  db: {
    dbName: 'lowtech-gmbh',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false
  },
  server: {
    port: 8000,
    host: '0.0.0.0',
  },
  // aws: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // },
};
