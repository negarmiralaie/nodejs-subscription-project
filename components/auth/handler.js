const _ = require('lodash');
const jwt = require('jsonwebtoken');
const db = require('../../models');
const ErrorHandler = require('../errorHandler');

class AuthHandler {
  static tokenKey =
    'User' +
    (process.env.USER_APP_KEY || 'authenticator.generateSecret()') +
    'Lorem User real';

  static async UserVerify(token) {
    try {
      let decode = await jwt.decode(token, this.userKey);
      console.log('decodeeee', decode);
      console.log('decode.sub', decode.sub);

      const loggedInPerson = await db.User.findByPk(decode.sub);
      console.log('loggedInPerson', loggedInPerson)
      // NOW YOU SHOULD CHECK HIS STATUS....
      if (loggedInPerson) {
        if (loggedInPerson.status == StatusList[0]) {
          console.log(1)
          console.log('loggedInPerson', loggedInPerson)
          return { user: loggedInPerson, decode };
        } else {
          console.log(2)
          let err = new ErrorHandler(
            'وضعیت کاربری شما فعال نیست با پشتیبانی تماس بگیرید',
            401,
            'UnAUTH'
          );
          throw err;
        }
      } else {
        console.log('no')
      }
      let err = new ErrorHandler(
        'کاربر غیر مجاز، لطفا مجددا وارد اکانت شوید',
        401,
        'UnAUTH'
      );
      throw err;
    } catch (error) {
      throw error;
    }
  }

  static async AdminGen(admin) {
    return await jwt.sign({ _type: 'admin' }, this.adminKey, {
      subject: admin.id + '',
    });
  }

  static async FactoryGen(factory) {
    return await jwt.sign({ _type: 'factory' }, this.factoryKey, {
      subject: factory.id + '',
    });
  }

  //will create new user token and update user.lastLoginAt
  //to the new time
  static async TokenGen(user, type = 'user') {
    // create a new jwt token
    const accessToken = jwt.sign({ _type: type }, this.tokenKey, {
      subject: user.id + '',
      expiresIn: '2d',
    });

    const lastloginToken = jwt.decode(accessToken);
    //set lastlogin to new token iat so other tokens will deactivate
    user.lastLoginAt = new Date(lastloginToken.iat * 1000);
    await user.save();
    return { accessToken };
  }

  //check token be valid
  //*not expired
  //*user.lastlogin==token.iat
  //*user.status==active
  static async TokenVerify(token, type = 'user') {
    try {
      //decoce the jwt to get the data in it
      const decode = await jwt.verify(token, this.userKey);
      let loggedInPerson;
      if (decode._type != type) {
        const err = new ErrorHandler(
          'کاربر غیر مجاز، لطفا مجددا وارد اکانت شوید',
          401,
          '401'
        );
        throw err;
      }

      // If user was a user or an admin, find him from db....
      if (decode._type == 'user') loggedInPerson = await db.User.findByPk(decode.sub);
      else if (decode._type == 'factory') loggedInPerson = await db.Factory.findByPk(decode.sub);
      else
      loggedInPerson = await db.Driver.findByPk(decode.sub, { // !!!!!!!
          attributes: [
            'id',
            'fname',
            'lname',
            'phoneNumber',
            'lastLoginAt',
            'status',
            'capacity',
            'lastLocation',
            'credit',
          ],
        });

      if (loggedInPerson) {
        if (loggedInPerson.status == StatusList[0]) {
          //user.lastLoginAt != new Date(decode.iat * 1000)
          if (Date.parse(loggedInPerson.lastLoginAt) != decode.iat * 1000) { //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            let err = new ErrorHandler(
              'نشست شما پایان یافته است لطفا دوباره وارد شوید',
              401,
              'Session_Expired'
            );
            throw err;
          }
          return loggedInPerson;
        } else {
          let err = new ErrorHandler(
            'کاربر غیر فعال شده است با پشتیبانی تماس بگیرید',
            401,
            user.status
          );
          throw err;
        }
      }
      let err = new ErrorHandler(
        'کاربر غیر مجاز، لطفا مجددا وارد اکانت شوید',
        401,
        '401'
      );
      throw err;
    } catch (error) {
      // let err = new ErrorHandler("کاربر غیر مجاز، لطفا مجددا وارد اکانت شوید", 401, "UnAUTH");
      throw error;
    }
  }

  // this function used especially for driver fill info
  static async DirverTokenVerify(token, type = 'user') {
    try {
      //decoce the jwt to get the data in it
      let decode = await jwt.verify(token, AuthHandler.userKey);
      let user;
      if (decode._type != type) {
        let err = new ErrorHandler(
          'کاربر غیر مجاز، لطفا مجددا وارد اکانت شوید',
          401,
          '401'
        );
        throw err;
      }
      user = await db.Driver.findByPk(decode.sub, {
        attributes: [
          'id',
          'status',
          'fname',
          'lname',
          'phoneNumber',
          'SSN',
          'sex',
          'photoUrl',
          'certificationCode',
          'lastLoginAt',
        ],
      });

      if (!user) {
        let err = new ErrorHandler(
          'کاربر غیر مجاز، لطفا مجددا وارد اکانت شوید',
          401,
          '401'
        );
        throw err;
      }

      return user;
    } catch (error) {
      // let err = new ErrorHandler("کاربر غیر مجاز، لطفا مجددا وارد اکانت شوید", 401, "UnAUTH");
      throw error;
    }
  }
}

module.exports = AuthHandler;
