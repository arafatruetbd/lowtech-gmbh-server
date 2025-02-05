"use strict";

const handlers = require("../handlers/inventoryHandler");
const validations = require("../validations/inventory");

module.exports = [
  {
    path: "/inventory/{productId}",
    method: "GET",
    handler: handlers.getStock,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_inventory"], // ✅ Only authorized users can view inventory
      },
    },
  },
  {
    path: "/inventory/{productId}",
    method: "PUT",
    handler: handlers.updateStock,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_inventory"], // ✅ Only authorized users can update stock
      },
      validate: validations.updateStock,
    },
  },
  {
    path: "/inventory/{productId}/threshold",
    method: "PUT",
    handler: handlers.setThreshold,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_inventory"], // ✅ Only authorized users can set thresholds
      },
      validate: validations.setThreshold,
    },
  },
];
