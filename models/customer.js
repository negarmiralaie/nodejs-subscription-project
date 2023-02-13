'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.Subscription, {
        foreignKey: 'customer_id',
      },{ onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    }
  }
  Customer.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creadit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    modelName: 'Customer',
  });

  paginate.paginate(Customer);
  return Customer;
};