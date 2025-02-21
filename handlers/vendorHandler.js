"use strict";

const vendorService = require("../services/vendorService");

// ✅ Create a Vendor
const createVendor = async (request, h) => {
  try {
    const vendor = await vendorService.createVendor(request.payload);
    return h.response(vendor).code(201);
  } catch (err) {
    console.error("Vendor Creation Error:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Get All Vendors
const getVendors = async (request, h) => {
  try {
    const vendors = await vendorService.getVendors();
    return h.response(vendors).code(200);
  } catch (err) {
    console.error("Fetch Vendors Error:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Get a Single Vendor by ID
const getVendorById = async (request, h) => {
  try {
    const vendor = await vendorService.getVendorById(request.params.vendorId);
    if (!vendor) return h.response({ error: "Vendor Not Found" }).code(404);
    return h.response(vendor).code(200);
  } catch (err) {
    console.error("Fetch Vendor Error:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Update Vendor Details
const updateVendor = async (request, h) => {
  try {
    const vendor = await vendorService.updateVendor(
      request.params.vendorId,
      request.payload
    );
    if (!vendor) return h.response({ error: "Vendor Not Found" }).code(404);
    return h.response(vendor).code(200);
  } catch (err) {
    console.error("Update Vendor Error:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Delete a Vendor
const deleteVendor = async (request, h) => {
  try {
    const success = await vendorService.deleteVendor(request.params.vendorId);
    if (!success) return h.response({ error: "Vendor Not Found" }).code(404);
    return h.response({ message: "Vendor deleted successfully" }).code(200);
  } catch (err) {
    console.error("Delete Vendor Error:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Create a Banner for a Vendor
const createBanner = async (request, h) => {
  try {
    const banner = await vendorService.createBanner(
      request.params.vendorId,
      request.payload
    );
    return h.response(banner).code(201);
  } catch (err) {
    console.error("Banner Creation Error:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Get All Banners for a Vendor
const getAllVendorBanners = async (request, h) => {
    try {
      const banners = await vendorService.getAllVendorBanners();
      return h.response(banners).code(200);
    } catch (err) {
      console.error("Fetch Banners Error:", err);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  };

// ✅ Get All Banners for a Vendor
const getVendorBanners = async (request, h) => {
  try {
    const banners = await vendorService.getVendorBanners(
      request.params.vendorId
    );
    return h.response(banners).code(200);
  } catch (err) {
    console.error("Fetch Banners Error:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Create a Category for a Vendor
const createCategory = async (request, h) => {
  try {
    const category = await vendorService.createCategory(
      request.params.vendorId,
      request.payload
    );
    return h.response(category).code(201);
  } catch (err) {
    console.error("Category Creation Error:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

// ✅ Get All Categories for a Vendor
const getVendorCategories = async (request, h) => {
  try {
    const categories = await vendorService.getVendorCategories(
      request.params.vendorId
    );
    return h.response(categories).code(200);
  } catch (err) {
    console.error("Fetch Categories Error:", err);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  createBanner,
  getAllVendorBanners,
  getVendorBanners,
  createCategory,
  getVendorCategories,
};
