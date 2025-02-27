const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: "0.0.0.0", // Ensure it listens on all interfaces
    routes: {
      cors: {
        origin: ["*"], // Allow all origins (or specify your frontend: ["https://lowtech-gmbh.s3-website.eu-central-1.amazonaws.com"])
        headers: ["Accept", "Content-Type", "Authorization"],
        additionalHeaders: ["X-Requested-With"],
        credentials: true, // Allows cookies and authentication headers
      },
    },
  });

  // Enable CORS for preflight requests
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      response.output.headers["Access-Control-Allow-Origin"] = "*";
      response.output.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
      response.output.headers["Access-Control-Allow-Headers"] = "Accept, Content-Type, Authorization";
    }
    return h.continue;
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
    await syncAndSeed();
    console.log("✅ Database synced and seeded.");
  } catch (error) {
    console.error("❌ Database Error:", error);
    process.exit(1);
  }

  await server.start();
  console.log(`🚀 Server running on ${server.info.uri}`);
};
