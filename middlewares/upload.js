"use strict";

const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const config = require("../config");

// Initialize S3 Client
const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

// ✅ Middleware for Image Upload
const uploadImage = async (request, h) => {
  if (!request.payload.image) {
    return h.response({ error: "Image is required" }).code(400);
  }

  const file = request.payload.image;
  const filename = `uploads/${Date.now()}-${file.hapi.filename}`;

  try {
    // ✅ Use AWS SDK `Upload` to handle streaming data
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: config.aws.bucketName,
        Key: filename,
        Body: file,
        ContentType: file.hapi.headers["content-type"],
      },
    });

    const uploadResult = await upload.done();

    // ✅ Attach image URL to the request payload
    request.payload.imageUrl = uploadResult.Location;

    return h.continue;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return h.response({ error: "Image upload failed" }).code(500);
  }
};

module.exports = uploadImage;
