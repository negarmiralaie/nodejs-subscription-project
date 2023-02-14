const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/adminAuther');
const {subscriptionController} = require('../../controllers');

/* GET home page. */
router.get('/', (req, res) => {
    res.send('Subscription home routes');
});

router.post('/create', auth(), subscriptionController.create);
router.get('/list', auth(), subscriptionController.list);
router.get('/toggleIsActive', auth(), subscriptionController.toggleIsActive);

module.exports = router;