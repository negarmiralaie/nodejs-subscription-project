const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');


/* GET home page. */
router.get('/', (req, res) => {
    res.send('Authentication routes');
});
  
router.post('/register', authController.register);
router.post('/login', authController.login);
// router.delete('/user/logout', authController.logout);

module.exports = router;
