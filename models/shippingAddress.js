module.exports = (sequelize, DataTypes) => {
    const ShippingAddress = sequelize.define(
      "ShippingAddress",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "orders",
            key: "id",
          },
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        postalCode: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "shipping_addresses",
        timestamps: true,
      }
    );
  
    return ShippingAddress;
  };
  