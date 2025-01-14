"use strict";

const { Sequelize } = require("sequelize");
const config = require("../config");

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: config.app.env !== "production" ? console.log : false,
  }
);

// Initialize models
const Role = require("./role")(sequelize, Sequelize);
const Permission = require("./permission")(sequelize, Sequelize);
const User = require("./user")(sequelize, Sequelize);
const Vendor = require("./vendor")(sequelize, Sequelize);
const UserAddress = require("./user_address")(sequelize, Sequelize);
const RolePermissions = require("./rolePermissions")(sequelize, Sequelize);

// Define associations
function defineAssociations() {
  // User and Role
  User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

  // User and Vendor
  User.belongsTo(Vendor, { foreignKey: "vendorId", as: "vendor" });
  Vendor.hasMany(User, { foreignKey: "vendorId", as: "users" });

  // User and UserAddress
  User.hasMany(UserAddress, { foreignKey: "userId", as: "addresses" });

  // Role and Permission
  Role.belongsToMany(Permission, {
    through: RolePermissions,
    foreignKey: "roleId",
    otherKey: "permissionId",
  });
  Permission.belongsToMany(Role, {
    through: RolePermissions,
    foreignKey: "permissionId",
    otherKey: "roleId",
  });
}

// Apply associations after model initialization
defineAssociations();

// Seed database
async function seedDatabase() {
  // Default permissions for roles
  const defaultPermissions = {
    buy_product: false,
    manage_product: false,
    manage_vendor: false,
    manage_brand: false,
    manage_category: false,
    manage_sub_category: false,
    manage_order: false,
    manage_user: false,
    manage_sub_admin: false,
    read_admin_panel: false,
    manage_accounting: false,
  };

  // Create default permissions
  const permissionNames = Object.keys(defaultPermissions);
  const permissions = await Promise.all(
    permissionNames.map(async (name) => {
      const existingPermission = await Permission.findOne({ where: { name } });
      if (!existingPermission) {
        return Permission.create({ name });
      }
      return existingPermission;
    })
  );

  // Create Roles
  const seedRoles = [
    {
      name: "user",
      permissions: { ...defaultPermissions, buy_product: true }, // user can buy products
    },
    {
      name: "admin",
      permissions: {
        ...defaultPermissions,
        manage_product: true,
        manage_sub_admin: true,
        manage_user: true,
        manage_vendor: true,
        manage_brand: true,
        manage_category: true,
        manage_sub_category: true,
        manage_order: true,
        read_admin_panel: true,
        manage_accounting: true,
      },
    },
    {
      name: "sub-admin",
      permissions: {
        ...defaultPermissions,
        manage_product: true,
        manage_brand: true,
        manage_category: true,
        manage_sub_category: true,
        manage_order: true,
        read_admin_panel: true,
      },
    },
  ];

  // Seed roles and associate permissions
  for (let roleData of seedRoles) {
    const role = await Role.create({ name: roleData.name });

    // Find and associate the permissions for each role
    const rolePermissions = permissions.filter(
      (permission) => roleData.permissions[permission.name]
    );

    // Associate role with permissions
    await role.setPermissions(rolePermissions);
  }

  // Seed Vendor
  if ((await Vendor.count()) === 0) {
    await Vendor.create({
      name: "Main",
      slug: "main",
      email: "main@mail.com",
      phone: "01234567890",
    });
    console.log("Vendor seeded successfully");
  }

  // Seed Admin User (if none exists)
  if ((await User.count()) === 0) {
    await User.create({
      name: "Admin",
      email: "admin@mail.com",
      phone: "01234567890",
      password: "xxxxxxxxxxxxxxx", // Ensure this is securely hashed in real-world apps
      roleId: 2, // Assuming 'admin' is the second role
      vendorId: 1, // Assuming 'Main' vendor is the first vendor
    });
    console.log("Admin user seeded successfully");
  }
}

async function syncAndSeed() {
  try {
    // Sync models in the correct order to avoid dependency issues
    // await Role.sync({ alter: true });
    // await Permission.sync({ alter: true });
    // await RolePermissions.sync({ alter: true });
    // await Vendor.sync({ alter: true });
    // await User.sync({ alter: true });
    // await UserAddress.sync({ alter: true });

    // // Seed database
    // await seedDatabase();

    console.log("Models synced and data seeded successfully");
  } catch (error) {
    console.error("Error syncing or seeding database:", error);
  }
}

module.exports = {
  sequelize,
  Sequelize,
  Role,
  Permission,
  User,
  Vendor,
  UserAddress,
  RolePermissions,
  syncAndSeed,
};
