const Joi = require("@hapi/joi");

const orderItemSchema = Joi.object({
  productId: Joi.number().integer().required(),
  name: Joi.string().required(),
  qty: Joi.number().integer().min(1).required(),
  image: Joi.string().uri().required(),
  price: Joi.number().precision(2).required(),
});

const shippingAddressSchema = Joi.object({
  address: Joi.string().required(),
  city: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
});

const createOrderValidation = {
  payload: Joi.object({
    orderItems: Joi.array().items(orderItemSchema).min(1).required(),
    shippingAddress: shippingAddressSchema.required(),
    paymentMethod: Joi.string()
      .valid("PayPal", "Credit Card", "Bank Transfer")
      .required(),
    itemsPrice: Joi.number().precision(2).min(0).required(),
    shippingPrice: Joi.number().precision(2).min(0).required(),
    taxPrice: Joi.number().precision(2).min(0).required(),
    totalPrice: Joi.number().precision(2).min(0).required(),
  }),
};

module.exports = { createOrderValidation };
