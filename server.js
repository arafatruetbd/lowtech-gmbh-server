const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: "0.0.0.0", // Accept requests from external sources
    routes: {
      cors: {
        origin: ["*"], // Allow all origins for debugging (change to your S3 URL later)
        headers: ["Accept", "Content-Type", "Authorization"],
        credentials: true,
      },
    },
  });

  // Middleware to manually set CORS headers
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      response.output.headers["Access-Control-Allow-Origin"] =
        "https://lowtech-gmbh.s3-website.eu-central-1.amazonaws.com";
      response.output.headers["Access-Control-Allow-Methods"] =
        "GET, POST, PUT, DELETE, OPTIONS";
      response.output.headers["Access-Control-Allow-Headers"] =
        "Content-Type, Authorization";
      response.output.headers["Access-Control-Allow-Credentials"] = "true";
    } else {
      response.headers = {
        ...response.headers,
        "Access-Control-Allow-Origin":
          "https://lowtech-gmbh.s3-website.eu-central-1.amazonaws.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      };
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
