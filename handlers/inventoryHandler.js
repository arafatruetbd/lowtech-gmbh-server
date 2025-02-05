"use strict";

const inventoryService = require("../services/inventoryService");

// Get Stock Level
const getStock = async (request, h) => {
  try {
    const stock = await inventoryService.getStockLevel(
      request.params.productId
    );
    if (!stock) return h.response({ error: "Product Not Found" }).code(404);
    return h.response(stock).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// Update Stock Level
const updateStock = async (request, h) => {
  try {
    const { quantityChange } = request.payload;
    const updatedStock = await inventoryService.updateStockLevel(
      request.params.productId,
      quantityChange
    );
    return h.response(updatedStock).code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({ error: err.message || "Internal Server Error" })
      .code(500);
  }
};

// Set Low Stock Threshold
const setThreshold = async (request, h) => {
  try {
    const { threshold } = request.payload;
    const updatedStock = await inventoryService.setLowStockThreshold(
      request.params.productId,
      threshold
    );
    return h.response(updatedStock).code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({ error: err.message || "Internal Server Error" })
      .code(500);
  }
};

module.exports = { getStock, updateStock, setThreshold };
