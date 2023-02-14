'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      Invoice.belongsTo(models.Subscription, {
        foreignKey: 'subscription_id',
      },{ onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    }
  }
  Invoice.init({
    name: { //! DELETE THIS ONEEEEEEEEE!!!!!!!!! AND UPDATE INVOICE GENERATOR
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isActive: { //! DELETE THIS ONEEEEEEEEE!!!!!!!!! AND UPDATE INVOICE GENERATOR
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
    modelName: 'Invoice',
  });

  paginate.paginate(Invoice);
  return Invoice;
};
