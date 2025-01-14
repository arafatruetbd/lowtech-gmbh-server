"use strict";

const adminHandler = require("../handlers/adminHandler");
const enforceRoles = require("../middlewares/enforceRoles");

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
      pre: [{ method: enforceRoles(["admin"]) }],
    },
  },
  {
    method: "POST",
    path: "/auth/sub-admin/login",
    handler: adminHandler.subAdminLogin,
    options: { auth: false },
  },
];
