const Joi = require("@hapi/joi");
const paymentHandler = require("../handlers/paymentHandler");

module.exports = [
  {
    path: "/orders/{orderId}/pay",
    method: "POST",
    handler: paymentHandler.payOrder,
    options: {
      auth: false,
      validate: {
        params: Joi.object({
          orderId: Joi.number().integer().required(),
        }),
        payload: Joi.object({
          id: Joi.string().required(),
        }),
      },
    },
  },
];
