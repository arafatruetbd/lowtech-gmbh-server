"use strict";
const root = require("./root");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const inventoryRoutes = require("./inventoryRoutes");

module.exports = [].concat(
  root,
  userRoutes,
  adminRoutes,
  categoryRoutes,
  productRoutes,
  inventoryRoutes
);
