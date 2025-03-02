"use strict";

const Hapi = require("@hapi/hapi");
const { sequelize, syncAndSeed } = require("./models");
const routes = require("./routes");
const logger = require("./plugins/logger");
const auth = require("./plugins/auth");

const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: "localhost",
    routes: {
      cors: true,
      validate: {
        failAction: async (request, h, err) => {
          console.error(err);
          throw err;
        },
      },
    },
  });

  // Register plugins
  await server.register(logger);
  await server.register(auth);

  // Add routes
  server.route(routes);

  // Initialize DB and seed
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");

    // await syncAndSeed();
    console.log("✅ Database synced and seeded.");
  } catch (error) {
    console.error("❌ Database Error:", error);
    process.exit(1);
  }

  await server.start();
  console.log(`🚀 Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
