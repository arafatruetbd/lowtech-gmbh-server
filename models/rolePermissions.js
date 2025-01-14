"use strict";

module.exports = (sequelize, DataTypes) => {
  const RolePermissions = sequelize.define(
    "RolePermissions",
    {
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Roles", // 'Roles' table name
          key: "id",
        },
      },
      permissionId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Permissions", // 'Permissions' table name
          key: "id",
        },
      },
    },
    {
      tableName: "role_permissions",
      timestamps: false,
    }
  );

  return RolePermissions;
};
