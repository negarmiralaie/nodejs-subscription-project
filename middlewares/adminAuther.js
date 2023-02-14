const { AuthHandler } = require('../components/auth');
const { admin } = require('./authMiddlewares');

module.exports = (act, obj) => {
  return async (req, res, next) => {
    try {
      let customer = req.customer;
      if (!customer) { //If user was not already stored in req(meaning previous middleware was not called) -> do exactly like what we did in previous middleware to check token and store user in req
        const header = req.headers;
        if ( req.headers && req.headers.authentication ){
          const data = ( await AuthHandler.CustomerVerify(req.headers.authentication) );
          customer = data.customer
        }
      }

      if (!customer) return res.sendStatus(401);
      req.customer = customer;
      next();
      return;
    } catch (error) {
      return res.sendStatus(401);
    }
  };
};