const express = require('express');
const router = express.Router();

/* GET home page. */
router.use('/api/v1', require('./v1/index'));

module.exports = router;
