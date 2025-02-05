"use strict";

const categoryService = require("../services/categoryService");

// Create Category
const createCategory = async (request, h) => {
  try {
    const category = await categoryService.createCategory(request.payload);
    return h.response(category).code(201);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// Get All Categories
const getCategories = async (request, h) => {
  try {
    const categories = await categoryService.getCategories();
    return h.response(categories).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// Get Single Category
const getCategoryById = async (request, h) => {
  try {
    const category = await categoryService.getCategoryById(request.params.id);
    if (!category) return h.response({ error: "Category Not Found" }).code(404);
    return h.response(category).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// Update Category
const updateCategory = async (request, h) => {
  try {
    const category = await categoryService.updateCategory(
      request.params.id,
      request.payload
    );
    if (!category) return h.response({ error: "Category Not Found" }).code(404);
    return h.response(category).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// Delete Category
const deleteCategory = async (request, h) => {
  try {
    const deleted = await categoryService.deleteCategory(request.params.id);
    if (!deleted) return h.response({ error: "Category Not Found" }).code(404);
    return h.response({ message: "Category deleted successfully" }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
