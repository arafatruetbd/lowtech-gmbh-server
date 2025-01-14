"use strict";

const Jwt = require("@hapi/jwt");
const config = require("../config");
const { User, Role, Permission } = require("../models");

module.exports = {
  name: "auth",
  register: async (server) => {
    await server.register(Jwt);

    server.auth.strategy("jwt", "jwt", {
      keys: config.jwt.secret,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        maxAgeSec: config.jwt.expiresIn,
      },
      validate: async (artifacts) => {
        const user = await User.findByPk(artifacts.decoded.payload.id, {
          include: {
            model: Role,
            include: [Permission], // Include permissions associated with the role
          },
        });

        if (!user) {
          return { isValid: false };
        }

        // Get the permissions (scopes) associated with the role
        const scopes = user.Role
          ? user.Role.Permissions.map((permission) => permission.name)
          : [];

        return {
          isValid: true,
          credentials: { id: user.id, role: user.roleId, scopes },
        };
      },
    });

    server.auth.default("jwt");
  },
};
