"use strict";
const root = require("./root");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const vendorRoutes = require("./vendorRoutes");
const orderRoutes = require("./orderRoutes");
const paymentRoutes = require("./paymentRoutes");

module.exports = [].concat(
  root,
  userRoutes,
  adminRoutes,
  categoryRoutes,
  productRoutes,
  inventoryRoutes,
  vendorRoutes,
  orderRoutes,
  paymentRoutes
);
