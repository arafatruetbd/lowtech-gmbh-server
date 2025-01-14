"use strict";

const authHandler = require("../handlers/userHandler");

module.exports = [
  {
    method: "POST",
    path: "/auth/signup",
    handler: authHandler.signUp,
    options: { auth: false },
  },
  {
    method: "POST",
    path: "/auth/signin",
    handler: authHandler.signIn,
    options: { auth: false },
  },
  {
    method: "POST",
    path: "/auth/signout",
    handler: authHandler.signOut,
    options: { auth: "jwt" },
  },
];
