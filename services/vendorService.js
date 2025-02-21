"use strict";

const { Vendor, Banner, Category } = require("../models");

// ✅ Create a Vendor
const createVendor = async (data) => {
  return await Vendor.create(data);
};

// ✅ Get All Vendors
const getVendors = async () => {
  return await Vendor.findAll({
    include: [
      { model: Category, as: "categories" },
      { model: Banner, as: "banners" },
    ],
  });
};

// ✅ Get Vendor by ID
const getVendorById = async (vendorId) => {
  return await Vendor.findByPk(vendorId, {
    include: [
      { model: Category, as: "categories" },
      { model: Banner, as: "banners" },
    ],
  });
};

// ✅ Update Vendor
const updateVendor = async (vendorId, data) => {
  const vendor = await Vendor.findByPk(vendorId);
  if (!vendor) return null;
  return await vendor.update(data);
};

// ✅ Delete Vendor
const deleteVendor = async (vendorId) => {
  const vendor = await Vendor.findByPk(vendorId);
  if (!vendor) return false;
  await vendor.destroy();
  return true;
};

// ✅ Create Banner for Vendor
const createBanner = async (vendorId, data) => {
  return await Banner.create({ ...data, vendorId });
};

// ✅ Get All Banners for All Vendor
const getAllVendorBanners = async (vendorId) => {
  return await Banner.findAll();
};

// ✅ Get All Banners for a Vendor
const getVendorBanners = async (vendorId) => {
  return await Banner.findAll({ where: { vendorId } });
};

// ✅ Create Category for Vendor
const createCategory = async (vendorId, data) => {
  return await Category.create({ ...data, vendorId });
};

// ✅ Get All Categories for a Vendor
const getVendorCategories = async (vendorId) => {
  return await Category.findAll({ where: { vendorId } });
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
