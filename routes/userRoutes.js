"use strict";

const handlers = require("../handlers/userHandler");

module.exports = [
  {
    method: "POST",
    path: "/users/signup",
    handler: handlers.signUp,
    options: { auth: false },
  },
  {
    method: "POST",
    path: "/users/signin",
    handler: handlers.signIn,
    options: { auth: false },
  },
  {
    method: "POST",
    path: "/users/signout",
    handler: handlers.signOut,
    options: { auth: "jwt" },
  }
];
