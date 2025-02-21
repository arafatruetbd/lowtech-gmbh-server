"use strict";

const orderService = require("../services/orderService");

// ✅ Place Order Handler
const placeOrder = async (request, h) => {
  try {
    const userId = request.auth.credentials.id;
    const orderId = await orderService.createOrder(userId, request.payload);

    return h.response({ success: true, orderId }).code(201);
  } catch (err) {
    console.error("Order Error:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Get Order by ID Handler
const getOrderById = async (request, h) => {
  try {
    const { orderId } = request.params;
    const order = await orderService.getOrderById(orderId);

    if (!order) return h.response({ error: "Order not found" }).code(404);

    return h.response(order).code(200);
  } catch (err) {
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Pay Order Handler
const payOrder = async (request, h) => {
  try {
    const { orderId } = request.params;
    const order = await orderService.payOrder(orderId, request.payload);

    if (!order) return h.response({ error: "Order not found" }).code(404);

    return h.response(order).code(200);
  } catch (err) {
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Get PayPal Client ID Handler
const getPaypalClientId = async (request, h) => {
  return h.response({ clientId: config.paypal.clientId }).code(200);
};

// ✅ Get Logged-in User Orders Handler
const getMyOrders = async (request, h) => {
  try {
    const userId = request.auth.credentials.id;
    const orders = await orderService.getMyOrders(userId);

    return h.response(orders).code(200);
  } catch (err) {
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Get All Orders (Admin) Handler
const getOrders = async (request, h) => {
  try {
    const orders = await orderService.getOrders();

    return h.response(orders).code(200);
  } catch (err) {
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Mark Order as Delivered Handler
const deliverOrder = async (request, h) => {
  try {
    const { orderId } = request.params;
    const order = await orderService.deliverOrder(orderId);

    if (!order) return h.response({ error: "Order not found" }).code(404);

    return h.response(order).code(200);
  } catch (err) {
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

module.exports = {
  placeOrder,
  getOrderById,
  payOrder,
  getPaypalClientId,
  getMyOrders,
  getOrders,
  deliverOrder,
};
