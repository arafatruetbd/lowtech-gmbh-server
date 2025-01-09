'use strict';
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const config = require('./config');
const routes = require('./routes');
const jwtAuthentication = require('@hapi/jwt');
const validateJwt = require('./helpers/validateJWT');
// const models = require('./models');
const ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET;

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'], // Adjust based on your security requirements
        additionalHeaders: ['authorization'],
      },
      validate: {
        failAction: async (request, h, err) => {
          if (ENV === 'production') {
            console.error('ValidationError:', err.message);
            throw Boom.badRequest('Invalid request payload input');
          } else {
            console.error(err);
            throw err;
          }
        },
      },
    },
    ...config.server,
  });

  // Register JWT authentication plugin
  await server.register(jwtAuthentication);

  server.auth.strategy('jwt', 'jwt', {
    keys: JWT_SECRET,
    verify: {
      aud: false, // Add audience validation if needed
      iss: false, // Add issuer validation if needed
      sub: false, // Add subject validation if needed
    },
    validate: validateJwt,
  });

  server.auth.default('jwt');


  // Sync database models (optional)
  // await models.sync({ alter: true });

  // Register routes
  server.route(routes);


  // Start the server
  await server.start();
  console.log('🚀 Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

init();
