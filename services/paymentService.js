const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Order } = require("../models");

/**
 * Processes payment for an order using Stripe
 * @param {string} orderId - Order ID
 * @param {string} paymentMethodId - Stripe Payment Method ID
 * @returns {object} Updated Order object if successful
 * @throws {Error} If payment fails or order is not found
 */
const processPayment = async (orderId, paymentMethodId) => {
  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // ✅ Create Stripe Payment Intent with auto payment methods
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // Convert to cents
    currency: "usd",
    payment_method: paymentMethodId,
    confirm: true,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never", // ✅ Prevent redirect-based payment methods
    },
  });

  if (paymentIntent.status === "succeeded") {
    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();
    return order;
  } else {
    throw new Error("Payment failed");
  }
};

module.exports = { processPayment };
