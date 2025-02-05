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
      validate: async (artifacts, request, h) => {
        try {
          // Fetch user along with role and permissions
          const user = await User.findByPk(artifacts.decoded.payload.id, {
            include: [
              {
                model: Role,
                as: "role", // ✅ Make sure you use the correct alias
                include: [
                  {
                    model: Permission,
                    as: "permissions", // ✅ Ensure alias is used
                    attributes: ["name"],
                    through: { attributes: [] }, // Exclude join table attributes
                  },
                ],
              },
            ],
          });

          if (!user) {
            return { isValid: false };
          }

          // Extract permission names as scope
          const scopes = user.role
            ? user.role.permissions.map((perm) => perm.name)
            : [];

          return {
            isValid: true,
            credentials: { id: user.id, role: user.role.name, scope: scopes }, // ✅ Store scopes properly
          };
        } catch (err) {
          console.error("JWT Validation Error:", err);
          return { isValid: false };
        }
      },
    });

    server.auth.default("jwt");
  },
};
