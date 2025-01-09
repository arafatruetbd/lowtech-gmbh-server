'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./common');
const crypto = require('crypto');
const Role = require('./role');
const Vendor = require('./vendor');
const UserAddress = require('./user_address');


const User = sequelize.define('user', {
  // attributes
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    unique: {
      args: true,
      msg: 'Email already in use.'
    },
    validate: {
      isEmail: {
        args: true,
        msg: 'Invalid Email'
      },
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isEmailVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isPasswordSet: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    defaultValue: ""
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  roleId: {
    type: Sequelize.UUID,
    references: {
      model: Role,
      key: 'id'
    }
  },
  vendorId: {
    type: Sequelize.UUID,
    references: {
      model: Vendor,
      key: 'id'
    }
  },
  permissions: {
    type: Sequelize.JSON,
    defaultValue: {}
  },
}, {
  instanceMethods: {
    validPassword(password) {
      password = crypto.pbkdf2Sync(password, '0167b7470070c801ee5789afe4a06a9f', 1000, 32, `sha512`).toString(`hex`);
      return password === this.password;
    }
  }
});

User.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  if (values.vendorId) {
  } else {
    delete values.vendorId;
  }
  delete values.password;
  return values;
};

User.beforeCreate(async (user, options) => {
  // when user is being created a role need to be assigned
  // and the role's permission will be set as user's permission
  // for security purpose, we send '-admin--'/'-sub-admin--' from payload to avoid

  user.password = crypto.pbkdf2Sync(user.password, '0167b7470070c801ee5789afe4a06a9f', 1000, 32, `sha512`).toString(`hex`);
  if (user.roleId === '-sub-admin---') {
    await Role.findOne({ where: { name: 'sub-admin' } }).then(role => {
      if (role) {
        user.roleId = role.id;
        user.permissions = role.permissions;
      }
    });
  } else if (user.roleId === '-admin--') {
    await Role.findOne({ where: { name: 'admin' } }).then(role => {
      if (role) {
        user.roleId = role.id;
        user.permissions = role.permissions;
      }
    });
  } else {
    await Role.findOne({ where: { name: 'user' } }).then(role => {
      if (role) {
        user.roleId = role.id;
        user.permissions = role.permissions;
      }
    });
  }

  if (user.vendorId === '-main--') {
    await Vendor.findOne({ where: { slug: 'main' } }).then(vendor => {
      if (vendor) {
        user.vendorId = vendor.id;
      }
    });
  }
});

User.beforeUpdate((user, options) => {
  if (user.changed('password')) {
    user.password = crypto.pbkdf2Sync(user.password, '0167b7470070c801ee5789afe4a06a9f', 1000, 32, `sha512`).toString(`hex`);
  }
});

User.belongsTo(Role);
User.belongsTo(Vendor);
User.hasMany(UserAddress);
UserAddress.belongsTo(User);

module.exports = User;
