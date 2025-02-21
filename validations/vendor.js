"use strict";

const Joi = require("@hapi/joi");

// ✅ Validation for Creating a Vendor
const createVendor = {
  payload: Joi.object({
    name: Joi.string().min(3).max(255).required(),
    address: Joi.string().max(500).allow(null, ""),
    contactEmail: Joi.string().email().allow(null, ""),
  }),
};

// ✅ Validation for Updating a Vendor
const updateVendor = {
  payload: Joi.object({
    name: Joi.string().min(3).max(255).optional(),
    address: Joi.string().max(500).optional(),
    contactEmail: Joi.string().email().optional(),
  }),
};

// ✅ Validation for Creating a Category under a Vendor
const createCategory = {
  payload: Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1000).optional(),
  }),
};

// ✅ Validation for Creating a Banner
const createBanner = {
  payload: Joi.object({
    imageUrl: Joi.string().required(),
    link: Joi.string().uri().optional(),
  }),
};

module.exports = {
  createVendor,
  updateVendor,
  createCategory,
  createBanner,
};
