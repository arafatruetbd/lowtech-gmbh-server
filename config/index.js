require("dotenv").config();

module.exports = {
  db: {
    dialect: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "app_db",
    username: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
  },
  app: {
    port: process.env.APP_PORT || 8000,
    env: process.env.NODE_ENV || "development",
  },
  jwt: {
    secret: "your_jwt_secret",
    expiresIn: 3600, // 1 hour
  },
  aws: {
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};
