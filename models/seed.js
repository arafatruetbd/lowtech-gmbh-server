"use strict";

const { Role, Permission, RolePermissions, User, Vendor } = require("./index"); // Ensure the correct import paths

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

/**
 * Seed roles, permissions, vendors, and admin user into the database.
 */
async function seedDatabase() {
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
      password: "mb@2K3^P-mY", // Ensure this is securely hashed in real-world apps
      roleId: 2, // Assuming 'admin' is the second role
      vendorId: 1, // Assuming 'Main' vendor is the first vendor
    });
    console.log("Admin user seeded successfully");
  }
}

module.exports = seedDatabase;
