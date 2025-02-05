"use strict";

const { Inventory, Product } = require("../models");

// Get Stock Level
const getStockLevel = async (productId) => {
  console.log("productID", productId);

  return await Inventory.findOne({ where: { productId } });
};

// Update Stock Level
const updateStockLevel = async (productId, quantityChange) => {
  const inventory = await Inventory.findOne({ where: { productId } });

  if (!inventory) {
    throw new Error("Product not found in inventory.");
  }

  inventory.stockLevel += quantityChange;
  await inventory.save();

  if (inventory.stockLevel < inventory.lowStockThreshold) {
    console.warn(
      `⚠️ Low Stock Alert! Product ID: ${productId} is running low.`
    );
    // Here you can trigger a notification system (e.g., send an email)
  }

  return inventory;
};

// Set Low Stock Threshold
const setLowStockThreshold = async (productId, threshold) => {
  const inventory = await Inventory.findOne({ where: { productId } });

  if (!inventory) {
    throw new Error("Product not found in inventory.");
  }

  inventory.lowStockThreshold = threshold;
  await inventory.save();

  return inventory;
};

module.exports = {
  getStockLevel,
  updateStockLevel,
  setLowStockThreshold,
};
