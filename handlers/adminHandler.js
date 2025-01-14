"use strict";

const adminService = require("../services/adminService");

module.exports = {
  adminLogin: async (request, h) => {
    try {
      const { email, password } = request.payload;
      const token = await adminService.adminLogin(email, password);
      return h.response({ message: "Admin login successful", token }).code(200);
    } catch (error) {
      return h.response({ error: error.message }).code(401);
    }
  },

  createSubAdmin: async (request, h) => {
    try {
      const { name, email, password } = request.payload;
      const subAdmin = await adminService.createSubAdmin(name, email, password);
      return h
        .response({ message: "Sub-Admin created successfully", subAdmin })
        .code(201);
    } catch (error) {
      return h.response({ error: error.message }).code(400);
    }
  },

  subAdminLogin: async (request, h) => {
    try {
      const { email, password } = request.payload;
      const token = await adminService.subAdminLogin(email, password);
      return h
        .response({ message: "Sub-Admin login successful", token })
        .code(200);
    } catch (error) {
      return h.response({ error: error.message }).code(401);
    }
  },
};
