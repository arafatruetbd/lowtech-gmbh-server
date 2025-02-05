"use strict";

const handlers = require("../handlers/categoryHandler");
const validations = require("../validations/category");

module.exports = [
  {
    path: "/categories",
    method: "POST",
    handler: handlers.createCategory,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_category"], // ✅ Only authorized users can create categories
      },
      validate: validations.createCategory,
    },
  },
  {
    path: "/categories",
    method: "GET",
    handler: handlers.getCategories,
    options: { auth: false },
  },
  {
    path: "/categories/{id}",
    method: "GET",
    handler: handlers.getCategoryById,
    options: {
      auth: {
        strategy: "jwt",
      },
    },
  },
  {
    path: "/categories/{id}",
    method: "PUT",
    handler: handlers.updateCategory,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_category"], // ✅ Only authorized users can update categories
      },
      validate: validations.updateCategory,
    },
  },
  {
    path: "/categories/{id}",
    method: "DELETE",
    handler: handlers.deleteCategory,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_category"], // ✅ Only authorized users can delete categories
      },
    },
  },
];
