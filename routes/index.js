"use strict";
const root = require("./root");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");

module.exports = [].concat(root, userRoutes, adminRoutes);
