"use strict";

const { Product, Category, Inventory } = require("../models");
const { Op } = require("sequelize");

// Fetch all products
const getProducts = async () => {
  return await Product.findAll({ include: "category" });
};

// Fetch a product by ID
const getProductById = async (id) => {
  return await Product.findByPk(id, { include: "category" });
};

// Searach Product
const searchProducts = async (keyword, pageNumber) => {
  const pageSize = 10; // Define page size
  const offset = (pageNumber - 1) * pageSize;

  const { rows: products, count } = await Product.findAndCountAll({
    where: {
      name: {
        [Op.iLike]: `%${keyword}%`, // Case-insensitive search
      },
    },
    limit: pageSize,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    products,
    page: pageNumber,
    pages: Math.ceil(count / pageSize),
  };
};
// Create a new product
const createProduct = async (data) => {
  const { categoryId, stock, image } = data;

  // ✅ Ensure category exists
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }

  // ✅ Create product with S3 image URL
  const product = await Product.create({
    ...data,
    image, // Store S3 image URL
  });

  // ✅ Create inventory record for this product
  await Inventory.create({
    productId: product.id,
    stockLevel: stock, // Set initial stock level
    lowStockThreshold: 5, // Default threshold (can be customized)
  });

  return product;
};
// Update a product
const updateProduct = async (id, data) => {
  const product = await Product.findByPk(id);
  if (!product) return null;
  return await product.update(data);
};

// Delete a product
const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) return null;
  await product.destroy();
  return true;
};

const fetchLatestProducts = async () => {
  return await Product.findAll({
    order: [["createdAt", "DESC"]], // Sort by latest created products
    limit: 8, // Fetch only 10 products
  });
};

const getProductsByCategory = async (categoryId) => {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }

  const products = await Product.findAll({
    where: { categoryId },
    order: [["createdAt", "DESC"]],
  });

  return { category, products };
};

module.exports = {
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchLatestProducts,
  getProductsByCategory,
};
