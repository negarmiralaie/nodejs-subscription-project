const joi = require('joi');
const db = require('../models');
const response = require('../components/responseHandler');
const { Helper } = require('../components/helper');
const { Op } = require('sequelize');

const base = db.Subscription;
const subscriptionController = {
  create: async (req, res) => {
    try {
      const schema = joi.object().keys({ 
        name: joi.string().required(),
        price: joi.number().required(),
        isActive: joi.boolean().required()
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      const customer = req.customer;
      value.customer_id = customer.id;

      const duplicate = await base.findAll({
        where: {
            [Op.and]: [
              {
                customer_id: customer.id
              },
              {
                name: value.name,
              },
            ],
        },
      });
      console.log('duplicate', duplicate)

      if (duplicate.length > 0) {
        return response.customError(
          res,
          res.t('CRUD.Duplicated', {
            name: res.t('joi.hybrid.name'),
          }),
          404
        );
      }

      const subscription = await base.create(value);
      console.log('subscription', subscription)

      return response.success(res, subscription, res.t('CRUD.Create'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  list: async (req, res) => {
    try {
      // base.truncate({cascade: true, restartIdentity:true}) //*
      const Schema = joi.object().keys({
        page: joi.number(),
        limit: joi.number(),
        filter: joi
          .object()
          .keys({
            where: joi
            .object()
            .keys({
              name: joi.string(),
              price: joi.number(),
              isActive: joi.boolean(),
            })
            .default({}),
            order: joi
              .object()
              .keys({
                by: joi.string().default('createdAt'),
                sort: joi.string().only().allow('asc', 'desc').default('desc'),
              })
              .default({ by: 'createdAt', sort: 'desc' }),
          })
          .default({ order: { by: 'createdAt', sort: 'desc' } }),
      });

      const { error, value } = Schema.validate(req.query, { abortEarly: true });
      if (error) return response.validation(res, error);

      let where = {};
      if (value.filter.where) {
        where = {
          ...value.filter.where,
        };
        if (where.name) where.name = where.name;
        if (where.price) where.mobile = where.price;
        if (where.isActive) where.status = where.isActive;
      }

      const subscriptions = await Helper.paginate(
        base,
        value.page,
        {
          order: [[value.filter.order.by, value.filter.order.sort]],
          where,
        },
        value.limit
      );

      return response.success(res, subscriptions, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }  },

  toggleIsActive: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        filter: joi
          .object()
          .keys({
            where: joi
            .object()
            .keys({
              name: joi.string(),
            })
            .default({}),
          })
      });

      const { error, value } = Schema.validate(req.query, { abortEarly: true });
      if (error) return response.validation(res, error);
      
      const customer_id = req.customer.id;

      let where = {};
      if (value.filter.where) {
        where = {
          ...value.filter.where,
        };
      }

      where.customer_id = customer_id;
      const subscription = await base.findOne({ where });
      if (subscription) {
        subscription.isActive = subscription.isActive !== false ? false : true;
        await subscription.save();
        return response.success(res, subscription, res.t('CRUD.Create'));
      } else {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', { name: res.t('joi.field.name') }),
          404
        );
      }

    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = subscriptionController;
