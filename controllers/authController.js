const joi = require('joi');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
// const db = require('../models/index');
// const { exRedis } = require('../../../components/redis');
const { Helper } = require('../components/helper');
const response = require('../components/responseHandler');
const { AuthHandler} = require('../components/auth');
const db = require('../models');

const base = db.Customer;
const authController = {
  register: async (req, res) => {
    try {
        const schema = joi.object().keys({
          username: joi.string().required(),
        });
  
        const { error, value } = schema.validate(req.body, { abortEarly: true });
        if (error) return response.validation(res, error);

        const repeatedCustomer = await db.Customer.findOne({ where: { username: value.username } });
        if (repeatedCustomer){
          return response.validation(
            res,
            res.t('CRUD.Duplicate', { name: res.t('joi.field.customer') })
          );
        };

        if (value.password) value.password = await Helper.Hash(value.password);
        value.creadit = 0;
        
        const customer = await base.create(value);
        // Creates a token for (meaning it's key will be the key used for admins).
        //~ LETS DISCUSS WHAT HAPPENS BELOW... FIRST AN ACCESS TOKEN WILL BE CREATED
        const { accessToken } = await AuthHandler.TokenGen(customer);
  
        
        res.setHeader('Authentication', accessToken);
        
        console.log('customer', customer);
        return response.success(res, {
          customer,
          accessToken,
        });
      } catch (err) {
        console.log(err);
        return response.customError(res, res.t('Server.Internall'), 500, err);
      }
  },
};

module.exports = authController;
// THIS LINE IS ADDED ON SATURDAY 5TH OF NOVEMBER.....