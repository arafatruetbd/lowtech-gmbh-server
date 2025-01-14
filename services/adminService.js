"use strict";

const { User } = require("../models");
const bcrypt = require("bcrypt");
const Jwt = require("@hapi/jwt");
const config = require("../config");

module.exports = {
  adminLogin: async (email, password) => {
    // Find the admin by email
    const admin = await User.findOne({ where: { email } });

    if (
      !admin ||
      admin.roleId !== 2 ||
      !(await bcrypt.compare(password, admin.password))
    ) {
      throw new Error("Invalid admin credentials");
    }

    // Generate JWT token for the admin
    const token = Jwt.token.generate(
      { id: admin.id, role: "admin" },
      {
        key: config.jwt.secret,
        algorithm: "HS256",
      },
      {
        ttlSec: config.jwt.expiresIn,
      }
    );

    return token;
  },

  createSubAdmin: async (name, email, password) => {
    // Hash the password before creating the sub-admin
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and return the sub-admin with Role 3
    const subAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      roleId: 3,
    });
    return subAdmin;
  },

  subAdminLogin: async (email, password) => {
    // Find the sub-admin by email
    const subAdmin = await User.findOne({ where: { email } });

    if (
      !subAdmin ||
      subAdmin.roleId !== 3 ||
      !(await bcrypt.compare(password, subAdmin.password))
    ) {
      throw new Error("Invalid sub-admin credentials");
    }

    // Generate JWT token for the sub-admin
    const token = Jwt.token.generate(
      { id: subAdmin.id, role: "sub-admin" },
      {
        key: config.jwt.secret,
        algorithm: "HS256",
      },
      {
        ttlSec: config.jwt.expiresIn,
      }
    );

    return token;
  },
};
