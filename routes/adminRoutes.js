"use strict";

const adminHandler = require("../handlers/adminHandler");

module.exports = [
  {
    method: "POST",
    path: "/auth/admin/login",
    handler: adminHandler.adminLogin,
    options: { auth: false },
  },
  {
    method: "POST",
    path: "/auth/admin/create-sub-admin",
    handler: adminHandler.createSubAdmin,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "POST",
    path: "/auth/sub-admin/login",
    handler: adminHandler.subAdminLogin,
    options: { auth: false },
  },
];
