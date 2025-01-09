'use strict';

const devConfig = require('./development');
const prodConfig = require('./production');


const isDev = process.env.NODE_ENV !== 'production';

module.exports = isDev ? devConfig : prodConfig;
