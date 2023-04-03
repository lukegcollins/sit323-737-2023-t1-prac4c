const router = require('express').Router();

// Avaiable Routes for this directory
router.use('/arithmetic', require('./arithmetic'));

module.exports = router;