"use strict";

const { User } = require("../models");
const bcrypt = require("bcrypt");
const Jwt = require("@hapi/jwt");
const config = require("../config");

module.exports = {
  createUser: async (name, email, password) => {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and return the user with Role 1: User
    return await User.create({
      name,
      email,
      password: hashedPassword,
      roleId: 1,
    });
  },

  authenticateUser: async (email, password) => {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = Jwt.token.generate(
      { id: user.id, role: user.roleId }, // Payload
      {
        key: config.jwt.secret, // Secret key
        algorithm: "HS256",
      },
      {
        ttlSec: config.jwt.expiresIn, // Token expiry in seconds
      }
    );

    return token;
  },

  signOut: async () => {
    // Token invalidation logic can be added here (if needed, e.g., using a token blacklist)
    return "Signed out successfully";
  },
};
