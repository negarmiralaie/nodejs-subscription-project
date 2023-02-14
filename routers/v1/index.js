const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/subscription', require('./subscription'));
router.use('/invoice', require('./invoice'));

module.exports = router;
