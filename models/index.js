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
    port: 5432, // Ensure correct PostgreSQL port
    dialectOptions: {
      ssl: {
        require: true, // AWS RDS requires SSL
        rejectUnauthorized: false, // Bypass self-signed cert issues
      },
    },
  }
);

// Initialize models
const Role = require("./role")(sequelize, Sequelize);
const Permission = require("./permission")(sequelize, Sequelize);
const User = require("./user")(sequelize, Sequelize);
const Vendor = require("./vendor")(sequelize, Sequelize);
const UserAddress = require("./user_address")(sequelize, Sequelize);
const RolePermissions = require("./rolePermissions")(sequelize, Sequelize);
const Category = require("./category")(sequelize, Sequelize);
const Product = require("./product")(sequelize, Sequelize);
const Inventory = require("./inventory")(sequelize, Sequelize);
const Banner = require("./banner")(sequelize, Sequelize);
const Order = require("./order")(sequelize, Sequelize);
const ShippingAddress = require("./shippingAddress")(sequelize, Sequelize);
const OrderItem = require("./orderItem")(sequelize, Sequelize);

// Define Associations
function defineAssociations() {
  // User and Role (One-to-One)
  User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
  Role.hasMany(User, { foreignKey: "roleId", as: "users" });

  // User and Vendor (One-to-Many)
  User.belongsTo(Vendor, { foreignKey: "vendorId", as: "vendor" });
  Vendor.hasMany(User, { foreignKey: "vendorId", as: "users" });

  // User and UserAddress (One-to-Many)
  User.hasMany(UserAddress, { foreignKey: "userId", as: "addresses" });

  // Role and Permission (Many-to-Many)
  Role.belongsToMany(Permission, {
    through: RolePermissions,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permissions", // ✅ Ensure alias matches your query
  });

  Permission.belongsToMany(Role, {
    through: RolePermissions,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "roles",
  });
  // Product and Category (One-to-Many)
  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  // Inventory and Product (One-to-One)
  Product.hasOne(Inventory, { foreignKey: "productId", as: "inventory" });
  Inventory.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // Vendor and Banner (One-to-many)
  Vendor.hasMany(sequelize.models.Banner, {
    foreignKey: "vendorId",
    as: "banners",
  });

  Banner.belongsTo(Vendor, { foreignKey: "vendorId", as: "vendor" });

  // Vendor and Category (One-to-many)
  Category.belongsTo(Vendor, { foreignKey: "vendorId", as: "vendor" });
  Vendor.hasMany(Category, { foreignKey: "vendorId", as: "categories" });

  // Order and User
  Order.belongsTo(User, { foreignKey: "userId", as: "user" });

  Order.hasMany(OrderItem, {
    foreignKey: "orderId",
    as: "orderItems",
  });

  Order.hasOne(ShippingAddress, {
    foreignKey: "orderId",
    as: "shippingAddress",
  });

  OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

  OrderItem.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
  });

  ShippingAddress.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
  });

  console.log("✅ Associations defined successfully!");
}

// Apply associations after model initialization
defineAssociations();

// Seed database function
async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
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
      manage_inventory: false,
    };

    // Create default permissions
    const permissionNames = Object.keys(defaultPermissions);
    const permissions = await Promise.all(
      permissionNames.map(async (name) => {
        const [permission] = await Permission.findOrCreate({
          where: { name },
          defaults: { name },
        });
        return permission;
      })
    );

    // Create Roles
    const seedRoles = [
      {
        name: "user",
        permissions: { ...defaultPermissions, buy_product: true },
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
          manage_inventory: true,
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
    const roles = await Promise.all(
      seedRoles.map(async (roleData) => {
        const [role] = await Role.findOrCreate({
          where: { name: roleData.name },
        });

        // Associate role with permissions
        const rolePermissions = permissions.filter(
          (permission) => roleData.permissions[permission.name]
        );

        await role.setPermissions(rolePermissions);
        return role;
      })
    );

    // Ensure Vendor exists before Users
    const [vendor] = await Vendor.findOrCreate({
      where: { name: "Main" },
      defaults: {
        name: "Main",
        address: "Main Street 123",
        contactEmail: "main@mail.com",
      },
    });

    console.log("✅ Vendor seeded successfully.");

    // Find the correct admin role dynamically
    const adminRole = roles.find((r) => r.name === "admin");
    if (!adminRole) {
      throw new Error("❌ Admin role not found!");
    }

    // Ensure Admin User is created after Vendor and Role exist
    if ((await User.count()) === 0) {
      await User.create({
        name: "Admin",
        email: "admin@mail.com",
        password: "xxxxxxxxxxxxxxx", // Ensure to hash password in production
        roleId: adminRole.id, // Assigning the correct roleId dynamically
        vendorId: vendor.id, // Assigning the correct vendorId dynamically
      });

      console.log("✅ Admin user seeded successfully.");
    }

    console.log("🎉 Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

// Sync and seed database
async function syncAndSeed() {
  try {
    console.log("🔄 Syncing database...");

    // Sync models in the correct order
    await sequelize.sync({ alter: true });

    console.log("✅ Models synced successfully!");

    // Call the seed function separately
    // await seedDatabase();

    console.log("🎉 Database ready!");
  } catch (error) {
    console.error("❌ Error syncing or seeding database:", error);
  }
}

// Export modules
module.exports = {
  sequelize,
  Sequelize,
  Role,
  Permission,
  User,
  Vendor,
  UserAddress,
  RolePermissions,
  Product,
  Category,
  Inventory,
  Banner,
  Order,
  OrderItem,
  ShippingAddress,
  syncAndSeed,
};
