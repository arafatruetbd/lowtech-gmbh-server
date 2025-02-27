"use strict";

const { Category } = require("../models");

// Create Category
const createCategory = async (data) => {
  try {
    return await Category.create(data);
  } catch (err) {
    console.error("❌ Error creating category in DB:", err);
    throw new Error("Database Error");
  }
};

// Function to check if category name already exists
const findCategoryByName = async (name) => {
  return await Category.findOne({ where: { name } });
};

// Get All Categories
const getCategories = async () => {
  return await Category.findAll();
};

// Get Category by ID
const getCategoryById = async (id) => {
  return await Category.findByPk(id);
};

// Update Category
const updateCategory = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) return null;
  return await category.update(data);
};

// Delete Category
const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) return false;
  await category.destroy();
  return true;
};

module.exports = {
  createCategory,
  findCategoryByName,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
