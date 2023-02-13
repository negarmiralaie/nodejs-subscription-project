const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/subscription', require('./subscription'));

module.exports = router;
