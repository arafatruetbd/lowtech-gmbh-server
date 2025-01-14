"use strict";

const handlers = require("../handlers/root");

module.exports = [
  {
    path: "/",
    method: "GET",
    handler: handlers.get,
    options: { auth: false },
  },
];
