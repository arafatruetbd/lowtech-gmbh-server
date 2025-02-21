"use strict";

const {
  Order,
  OrderItem,
  ShippingAddress,
  Product,
  User,
} = require("../models");
const { sendEmail } = require("../utils/emailService");

// ✅ Place Order Service
const createOrder = async (userId, payload) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = payload;

  // ✅ Create Order
  const order = await Order.create({
    userId,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  // ✅ Save Order Items
  for (const item of orderItems) {
    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
    });

    // ✅ Reduce Product Stock
    const product = await Product.findByPk(item.productId);
    if (product) {
      product.stock -= item.qty;
      await product.save();
    }
  }

  // ✅ Save Shipping Address
  await ShippingAddress.create({
    orderId: order.id,
    address: shippingAddress.address,
    city: shippingAddress.city,
    postalCode: shippingAddress.postalCode,
    country: shippingAddress.country,
  });

  // ✅ Fetch User Email
  const user = await User.findByPk(userId);
  if (user) {
    // ✅ Send Order Confirmation Email using AWS SES
    const emailHtml = `
        <h2>Order Confirmation</h2>
        <p>Thank you for your order, <b>${user.name}</b>!</p>
        <p>Your order ID: <b>${order.id}</b></p>
        <p>Total Amount: <b>$${totalPrice}</b></p>
        <p>Shipping to: ${shippingAddress.address}, ${shippingAddress.city}, ${
      shippingAddress.postalCode
    }, ${shippingAddress.country}</p>
        <hr />
        <h3>Order Items:</h3>
        <ul>
          ${orderItems
            .map(
              (item) => `<li>${item.qty} x ${item.name} - $${item.price}</li>`
            )
            .join("")}
        </ul>
        <p>We will notify you once your order is shipped.</p>
        <p>Best regards,<br> Your Store Team</p>
      `;

    await sendEmail(user.email, "Your Order Confirmation", emailHtml);
  }

  return order.id;
};

// ✅ Get Order by ID Service
const getOrderById = async (orderId) => {
  return await Order.findByPk(orderId, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"], // ✅ Only fetch necessary fields
      },
      {
        model: ShippingAddress,
        as: "shippingAddress",
        attributes: ["address", "city", "postalCode", "country"],
      },
      {
        model: OrderItem,
        as: "orderItems",
        attributes: ["id", "productId", "name", "qty", "image", "price"],
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name"], // ✅ Include product details
          },
        ],
      },
    ],
    attributes: [
      "id",
      "paymentMethod",
      "itemsPrice",
      "shippingPrice",
      "taxPrice",
      "totalPrice",
      "isPaid",
      "paidAt",
      "isDelivered",
      "deliveredAt",
      "createdAt",
    ],
  });
};

// ✅ Pay Order Service
const payOrder = async (orderId, paymentData) => {
  const order = await Order.findByPk(orderId);

  if (!order) return null;

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = paymentData;

  await order.save();
  return order;
};

// ✅ Get Logged-in User Orders
const getMyOrders = async (userId) => {
  return await Order.findAll({ where: { userId } });
};

// ✅ Get All Orders (Admin)
const getOrders = async () => {
  return await Order.findAll({ include: [{ model: User, as: "user" }] });
};

// ✅ Mark Order as Delivered
const deliverOrder = async (orderId) => {
  const order = await Order.findByPk(orderId);

  if (!order) return null;

  order.isDelivered = true;
  order.deliveredAt = new Date();
  await order.save();

  return order;
};

module.exports = {
  createOrder,
  getOrderById,
  payOrder,
  getMyOrders,
  getOrders,
  deliverOrder,
};
