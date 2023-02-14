const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/adminAuther');
const {invoiceController} = require('../../controllers');

/* GET home page. */
router.get('/', (req, res) => {
    res.send('Invoice home routes');
});

router.get('/list', auth(), invoiceController.list);
router.get('/report', auth(), invoiceController.report);

module.exports = router;