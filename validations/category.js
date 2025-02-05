"use strict";

const Joi = require("@hapi/joi");

module.exports = {
  createCategory: {
    payload: Joi.object({
      name: Joi.string().min(3).max(255).required(),
      description: Joi.string().max(500).optional(),
    }),
  },
  updateCategory: {
    payload: Joi.object({
      name: Joi.string().min(3).max(255).optional(),
      description: Joi.string().max(500).optional(),
    }),
  },
};
