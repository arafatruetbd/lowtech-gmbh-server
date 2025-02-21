const paymentService = require("../services/paymentService");

/**
 * Handles payment request from client
 * @param {object} request - Hapi request object
 * @param {object} h - Hapi response toolkit
 * @returns {object} API response
 */
const payOrder = async (request, h) => {
  try {
    const { orderId } = request.params;
    const { id: paymentMethodId } = request.payload;

    const updatedOrder = await paymentService.processPayment(
      orderId,
      paymentMethodId
    );

    return h.response(updatedOrder).code(200);
  } catch (err) {
    return h
      .response({ error: err.message || "Internal Server Error" })
      .code(400);
  }
};

module.exports = { payOrder };
