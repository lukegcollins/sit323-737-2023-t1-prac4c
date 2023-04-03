const router = require('express').Router();
const fn = require('path').basename(__filename);
const logger = require('../../../config/winston').logger;

// Avaiable Routes for this directory
router.use('/', require('./addition'));
router.use('/addition', require('./addition'));
router.use('/subtraction', require('./subtraction'));
router.use('/multiplication', require('./multiplication'));
router.use('/division', require('./division'));
router.use('/modulation', require('./modulation'));

// Handle all unmatched routes with a 404 error
router.use(function (error, req, res, next) {
    logger.error(`[${fn}]: Unmatched Route. Please check the error log for more information.`, error.details);
    res.status(404).json({
        error: 'Route not found. Available routes: api/addition/:num1/:num2, api/subtraction/:num1/:num2, api/multiplication/:num1/:num2, api/division/:num1/:num2, api/modulation/:num1/:num2'
    });

    next();
});

module.exports = router;