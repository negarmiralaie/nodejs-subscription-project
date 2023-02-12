const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.send('User home routes');
});

module.exports = router;