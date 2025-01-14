const good = require("@hapi/good");

module.exports = {
  plugin: {
    name: "logger",
    register: async (server) => {
      await server.register({
        plugin: good,
        options: {
          reporters: {
            console: [
              {
                module: "@hapi/good-squeeze",
                name: "Squeeze",
                args: [{ log: "*", response: "*" }],
              },
              {
                module: "@hapi/good-console",
              },
              "stdout",
            ],
          },
        },
      });
    },
  },
};
