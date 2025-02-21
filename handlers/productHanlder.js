"use strict";

const { Product, Category } = require("../models");
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

const getProductsBySearch = async (request, h) => {
  try {
    const { keyword = "", pageNumber = 1 } = request.query;
    const products = await productService.searchProducts(keyword, pageNumber);
    return h.response(products).code(200);
  } catch (err) {
    console.error("Error fetching products:", err);
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
    const { id } = request.params; // Get product ID from URL
    const { imageUrl, ...updateData } = request.payload;

    // ✅ Find the product
    const product = await Product.findByPk(id);
    if (!product) {
      return h.response({ error: "Product Not Found" }).code(404);
    }

    // ✅ Check if category exists before updating
    if (updateData.categoryId) {
      const category = await Category.findByPk(updateData.categoryId);
      if (!category) {
        return h.response({ error: "Invalid Category ID" }).code(400);
      }
    }

    // ✅ Update product with new data
    await product.update({
      ...updateData,
      image: imageUrl || product.image, // Keep old image if no new one
    });

    // ✅ Update inventory if stock is provided
    if (updateData.stock !== undefined) {
      let inventory = await Inventory.findOne({ where: { productId: id } });

      if (!inventory) {
        await Inventory.create({
          productId: id,
          stockLevel: updateData.stock,
          lowStockThreshold: 5,
        });
      } else {
        await inventory.update({ stockLevel: updateData.stock });
      }
    }

    return h.response(product).code(200);
  } catch (err) {
    console.error("Product Update Error:", err);
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
const getLatestProducts = async (request, h) => {
  try {
    const products = await productService.fetchLatestProducts();
    return h.response(products).code(200);
  } catch (err) {
    console.error("Error fetching latest products:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

const getCategoryProducts = async (request, h) => {
  try {
    const { categoryId } = request.params;
    const products = await productService.getProductsByCategory(categoryId);
    return h.response(products).code(200);
  } catch (err) {
    console.error("Error fetching category products:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getProductsBySearch,
  updateProduct,
  deleteProduct,
  getLatestProducts,
  getCategoryProducts,
};
