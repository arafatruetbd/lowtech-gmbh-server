"use strict";

const Joi = require("@hapi/joi");

// 🔹 Base Schema for Product
const baseProductSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(5).max(2000).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  categoryId: Joi.number().integer().required(),
  image: Joi.any().meta({ swaggerType: "file" }).description("Product Image"),
});

// 🔹 Create Product Validation
const createProduct = {
  payload: baseProductSchema,
};

// 🔹 Update Product Validation (Fields Optional)
const updateProduct = {
  payload: baseProductSchema.fork(
    Object.keys(baseProductSchema.describe().keys),
    (schema) => schema.optional()
  ),
};

module.exports = {
  createProduct,
  updateProduct,
};
