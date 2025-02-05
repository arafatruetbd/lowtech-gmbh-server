"use strict";

const productService = require("../services/productService");
// Create Product
const createProduct = async (request, h) => {
  try {
    const { imageUrl, ...productData } = request.payload;

    const product = await productService.createProduct({
      ...productData,
      image: imageUrl, // ✅ Save the image URL in the database
    });

    return h.response(product).code(201);
  } catch (err) {
    console.error("Product Creation Error:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// Get All Products
const getProducts = async (request, h) => {
  try {
    const products = await productService.getProducts();
    return h.response(products).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// Get Single Product
const getProductById = async (request, h) => {
  try {
    const product = await productService.getProductById(request.params.id);
    if (!product) return h.response({ error: "Product Not Found" }).code(404);
    return h.response(product).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// Update Product
const updateProduct = async (request, h) => {
  try {
    const product = await productService.updateProduct(
      request.params.id,
      request.payload
    );
    if (!product) return h.response({ error: "Product Not Found" }).code(404);

    return h.response(product).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// Delete Product
const deleteProduct = async (request, h) => {
  try {
    const deleted = await productService.deleteProduct(request.params.id);
    if (!deleted) return h.response({ error: "Product Not Found" }).code(404);

    return h.response({ message: "Product deleted successfully" }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
