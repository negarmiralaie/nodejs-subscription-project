const joi = require('joi');
const db = require('../models');
const response = require('../components/responseHandler');
const { Helper } = require('../components/helper');
const { Op } = require('sequelize');

const base = db.Subscription;
const subscriptionController = {
  create: async (req, res) => {
    console.log('dsa')
    try {
      console.log('reched here')
      const schema = joi.object().keys({ 
        name: joi.string().required(),
        price: joi.number().required(),
        isActive: joi.boolean().required()
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      // ! CAN USER MAKE MORE THAN 1 SUBSCRIPTION?
      // const subscription = await db.Subscription.findByPk(value.examined_id);
      // if (!subscription) {
      //   return response.customError(
      //     res,
      //     res.t('CRUD.Not_Found', { name: res.t('joi.field.personnel') }),
      //     404
      //   );
      // }

      const customer = req.customer;
      console.log('customersd', customer)
      value.customer_id = customer.id;

      const subscription = await base.create(value);
      console.log('subscription', subscription)

      return response.success(res, subscription, res.t('CRUD.Create'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = subscriptionController;
