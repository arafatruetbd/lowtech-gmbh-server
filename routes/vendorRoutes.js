"use strict";

const handlers = require("../handlers/vendorHandler");
const uploadImage = require("../middlewares/upload");
const validations = require("../validations/vendor");

module.exports = [
  // ✅ Create a Vendor
  {
    path: "/vendors",
    method: "POST",
    handler: handlers.createVendor,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_vendor"], // ✅ Only admin or vendor managers can create vendors
      },
      validate: validations.createVendor,
    },
  },

  // ✅ Get All Vendors
  {
    path: "/vendors",
    method: "GET",
    handler: handlers.getVendors,
    options: { auth: false }, // Public endpoint
  },

  // ✅ Get a Single Vendor by ID
  {
    path: "/vendors/{vendorId}",
    method: "GET",
    handler: handlers.getVendorById,
    options: { auth: false }, // Public endpoint
  },

  // ✅ Update Vendor Details
  {
    path: "/vendors/{vendorId}",
    method: "PUT",
    handler: handlers.updateVendor,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_vendor"], // ✅ Only vendor managers can update
      },
      validate: validations.updateVendor,
    },
  },

  // ✅ Delete a Vendor
  {
    path: "/vendors/{vendorId}",
    method: "DELETE",
    handler: handlers.deleteVendor,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_vendor"], // ✅ Only vendor managers can delete
      },
    },
  },

  // ✅ Add Banners for a Vendor
  {
    path: "/vendors/{vendorId}/banners",
    method: "POST",
    handler: handlers.createBanner,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_vendor"], // ✅ Vendor Managers can add banners
      },
      payload: {
        output: "stream",
        parse: true,
        multipart: { output: "stream" },
        allow: "multipart/form-data",
        maxBytes: 5 * 1024 * 1024, // 5MB limit
      },
      pre: [{ method: uploadImage }], // ✅ Image upload middleware
    },
  },

  // ✅ Get Banners for All Vendor
  {
    path: "/vendors/banners",
    method: "GET",
    handler: handlers.getAllVendorBanners,
    options: { auth: false }, // Public endpoint
  },

  // ✅ Get Banners for a Vendor
  {
    path: "/vendors/{vendorId}/banners",
    method: "GET",
    handler: handlers.getVendorBanners,
    options: { auth: false }, // Public endpoint
  },

  // ✅ Add Categories for a Vendor
  {
    path: "/vendors/{vendorId}/categories",
    method: "POST",
    handler: handlers.createCategory,
    options: {
      auth: {
        strategy: "jwt",
        scope: ["manage_vendor"], // ✅ Vendor Managers can add categories
      },
      validate: validations.createCategory,
    },
  },

  // ✅ Get Categories for a Vendor
  {
    path: "/vendors/{vendorId}/categories",
    method: "GET",
    handler: handlers.getVendorCategories,
    options: { auth: false }, // Public endpoint
  },
];
