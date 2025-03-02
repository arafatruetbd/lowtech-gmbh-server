"use strict";

const handlers = require("../handlers/orderHandler");
const validations = require("../validations/order");

module.exports = [
  // ✅ Create a New Order
  {
    path: "/orders",
    method: "POST",
    handler: handlers.placeOrder,
    options: {
      auth: {
        strategy: "jwt",
      },
      validate: validations.createOrderValidation,
    },
  },

  // ✅ Get Order by ID
  {
    path: "/orders/{orderId}",
    method: "GET",
    handler: handlers.getOrderById,
    options: {
      auth: {
        strategy: "jwt",
      },
    },
  },

  // ✅ Pay Order (Update Payment Status)
  {
    path: "/orders/{orderId}/pay",
    method: "PUT",
    handler: handlers.payOrder,
    options: {
      auth: {
        strategy: "jwt",
      },
    },
  },

  // ✅ Get PayPal Client ID
  {
    path: "/orders/paypal",
    method: "GET",
    handler: handlers.getPaypalClientId,
    options: {
      auth: false,
    },
  },

  // ✅ Get Orders of Logged-in User
  {
    path: "/orders/mine",
    method: "GET",
    handler: handlers.getMyOrders,
    options: {
      auth: {
        strategy: "jwt",
      },
    },
  },

  // ✅ Get All Orders (Admin)
  {
    path: "/orders",
    method: "GET",
    handler: handlers.getOrders,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_order"],
      },
    },
  },

  // ✅ Mark Order as Delivered (Admin)
  {
    path: "/orders/{orderId}/deliver",
    method: "PUT",
    handler: handlers.deliverOrder,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_order"],
      },
    },
  },
];
