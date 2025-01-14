"use strict";

const Hapi = require("@hapi/hapi");
const { sequelize, syncAndSeed } = require("./models");
const config = require("./config");
const routes = require("./routes");
const logger = require("./plugins/logger");
const auth = require("./plugins/auth");

const init = async () => {
  const server = Hapi.server({
    port: config.app.port,
    host: "0.0.0.0",
  });

  // Register plugins
  await server.register(logger);
  await server.register(auth);

  // Add routes
  server.route(routes);

  // Test database connection and seed data
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync and seed the database
    await syncAndSeed();

    console.log("Database synced and seeded successfully.");
  } catch (error) {
    console.error("Error during database initialization:", error);
    process.exit(1); // Exit if the database setup fails
  }

  // Start the server
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
