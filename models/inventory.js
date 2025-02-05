"use strict";

module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define(
    "Inventory",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      stockLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lowStockThreshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5, // Default threshold
      },
    },
    {
      tableName: "inventory",
      timestamps: true,
    }
  );

  return Inventory;
};
