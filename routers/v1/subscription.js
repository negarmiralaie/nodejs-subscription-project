const express = require('express');
const router = express.Router();
const {subscriptionController} = require('../../controllers');

/* GET home page. */
router.get('/', (req, res) => {
    res.send('Subscription home routes');
});

router.post('/create', subscriptionController.create);

module.exports = router;