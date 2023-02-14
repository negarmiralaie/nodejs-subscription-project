const AuthHandler = require('../components/auth/handler');
const response = require('../components/responseHandler');

const authMiddleware = {
  user: async (req, res, next) => {
    console.log(33)
    // 'user' is used to create token and token is stored in headers...
    if (
      req.headers &&
      req.headers.authentication
    ) {
      try {
        console.log(6)
        const { customer } = await AuthHandler.UserVerify( //Verifies the token stored in headers, gets back user which is used to create token
          req.headers.authentication
        );
        console.log(7)

        // Now store user data in req
        req.customer = customer;
        console.log('req.customer', req.customer)
        next();
      } catch (error) {
        req.customer = undefined;
        return response.customError(res, res.t('401', { scope: 'auth' }), 401);
      }
    } else {
      req.customer = undefined;
      return response.customError(res, res.t('401', { scope: 'auth' }), 401);
    }
  },
};

module.exports = authMiddleware;
