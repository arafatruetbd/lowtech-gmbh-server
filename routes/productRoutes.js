"use strict";

const handlers = require("../handlers/productHanlder");
const validations = require("../validations/product");
const uploadImage = require("../middlewares/upload");

module.exports = [
  {
    path: "/products",
    method: "POST",
    handler: handlers.createProduct,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_product"],
      },
      payload: {
        output: "stream", // ✅ Required for file upload
        parse: true,
        multipart: { output: "stream" }, // ✅ Ensure multipart form-data is handled correctly
        allow: "multipart/form-data",
        maxBytes: 5 * 1024 * 1024, // 5MB limit
      },
      validate: validations.createProduct,
      pre: [{ method: uploadImage }], // ✅ Use the updated middleware
    },
  },
  {
    path: "/products",
    method: "GET",
    handler: handlers.getProducts,
    options: {
      auth: false, // Public route (no authentication required)
    },
  },
  {
    path: "/products/{id}",
    method: "GET",
    handler: handlers.getProductById,
    options: {
      auth: false, // Public route
    },
  },
  {
    path: "/products/{id}",
    method: "PUT",
    handler: handlers.updateProduct,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_product"], // ✅ Only users with 'manage_product' scope can update products
      },
      validate: validations.updateProduct,
    },
  },
  {
    path: "/products/{id}",
    method: "DELETE",
    handler: handlers.deleteProduct,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_product"], // ✅ Only users with 'manage_product' scope can delete products
      },
    },
  },
];
