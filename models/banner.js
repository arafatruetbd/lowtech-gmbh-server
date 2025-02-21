module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define(
    "Banner",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vendorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "vendors",
          key: "id",
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true, // Link to the promotion or category
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Only active banners are displayed
      },
    },
    {
      tableName: "banners",
      timestamps: true,
    }
  );

  return Banner;
};
