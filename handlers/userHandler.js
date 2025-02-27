"use strict";

const userService = require("../services/userService");

module.exports = {
  signUp: async (request, h) => {
    try {
      const { name, email, password } = request.payload;
      const userInfo = await userService.createUser(name, email, password);
      return h
        .response({ message: "User registered successfully", userInfo })
        .code(201);
    } catch (error) {
      return h.response({ error: error.message }).code(400);
    }
  },

  signIn: async (request, h) => {
    try {
      const { email, password } = request.payload;
      const userInfo = await userService.authenticateUser(email, password);
      return h.response({ message: "Login successful", userInfo }).code(200);
    } catch (error) {
      return h.response({ error: error.message }).code(400);
    }
  },

  signOut: async (request, h) => {
    try {
      const message = await userService.signOut();
      return h.response({ message }).code(200);
    } catch (error) {
      return h.response({ error: "Failed to sign out" }).code(400);
    }
  },
};
