"use strict";

const Joi = require("@hapi/joi");

module.exports = {
  updateStock: {
    payload: Joi.object({
      quantityChange: Joi.number().integer().required(),
    }),
  },
  setThreshold: {
    payload: Joi.object({
      threshold: Joi.number().integer().required(),
    }),
  },
};
