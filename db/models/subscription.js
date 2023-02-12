'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      Subscription.hasMany(models.Invoice, {
        foreignKey: 'subscription_id',
      },{ onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
      Subscription.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
      },{ onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    }
  }
  Subscription.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
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
    modelName: 'Subscription',
  });

  paginate.paginate(Subscription);
  return Subscription;
};
