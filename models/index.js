const Role = require('./role');
const User = require('./user');
const Otp = require('./otp');


/**
 * Method to sync models sequentially.
 */
exports.sync = async function () {

  /**
   * Comment out the model sync method when need to update the model
   */

  // await Role.sync({ alter: true });
  // await User.sync({ alter: true });

  /**
   * Seed data
   */

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
    manage_accounting: false  // stock, payment method,payment status
  }
  const seedData = [
    {
      name: "user",
      permissions: {
        ...defaultPermissions,
        buy_product: true
      }
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
        manage_accounting: true
      }
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
      }
    }
  ];

  // await Role.count().then(async (count) => {
  //   console.log(count);
  //   if (count === 0) {
  //     await Role.bulkCreate(seedData);
  //   }
  // });

  // await Role.update({ ...seedData[0] }, { where: { id: 'ff236c63-7a94-4d2d-8990-9dda26ca6cae' } }); //user
  // await Role.update({ ...seedData[1] }, { where: { id: '7cce16c5-e435-4e7f-a7db-11e6840e3126' } }); //admin
  // await Role.update({ ...seedData[2] }, { where: { id: '5a50cf89-2af2-4c6b-8587-c625e50e540c' } }); //sub-admin
  // await User.update({ permissions: seedData[1].permissions }, { where: { id: 'fa478746-27a6-4e8e-b294-f190bf8a9fd3' } }) //admin id: user ID

  // await Vendor.count().then(async (count) => {
  //   console.log(count);
  //   if (count === 0) {
  //     Vendor.create({
  //       name: "Main",
  //       slug: "main",
  //       email: "main@mail.com",
  //       phone: "01234567890",
  //     })
  //   }
  // });

  // await User.count().then(async (count) => {
  //   console.log(count);
  //   if (count === 0) {
  //     await User.create({
  //       firstName: "Admin",
  //       lastName: "Admin",
  //       email: "admin@mail.com",
  //       phone: "01234567890",
  //       "password": "mb@2K3^P-mY",
  //       "verifyPassword": "mb@2K3^P-mY",
  //       "roleId": "-admin--",
  //       "vendorId": "-main--",
  //     })
  //   }
  // });

};
