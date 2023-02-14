const joi = require('joi');
const db = require('../models');
const response = require('../components/responseHandler');
const { Helper } = require('../components/helper');
const { Op } = require('sequelize');

const base = db.Invoice;
const invoiceController = {
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
              price: joi.number(), //!!!!! SHOULD BE DELETED
              isActive: joi.boolean(), //!!!!! SHOULD BE DELETED
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

      const invoices = await Helper.paginate(
        base,
        value.page,
        {
          order: [[value.filter.order.by, value.filter.order.sort]],
          where,
        },
        value.limit
      );

      return response.success(res, invoices, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }  },

    report: async (req, res) => {
        try {
            const customer_id = req.customer.id;
            const subscriptions = await db.Subscription.findAll({ where: {customer_id} });
            
            let totalInvoicesCount = 0;
            let totalInvoicesPrice = 0;

            for (let i=0; i<subscriptions.length ;i++){
                const { count: invoicesCount, rows: invoices } = await base.findAndCountAll();
                totalInvoicesCount += invoicesCount;
                for (let i=0; i< invoices.length; i++){
                    totalInvoicesPrice += invoices[i].dataValues.price;
                }
            }

            return response.success(res, {'Number of invoices': totalInvoicesCount, 'Total price': totalInvoicesPrice}, res.t('CRUD.Success'));
        } catch (error) {
            return response.catchError(res, error);
        }  },
};

module.exports = invoiceController;
