const router = require('express').Router();
const isAuth = require('../../authMiddleware').isAuth;
const isAdmin = require('../../authMiddleware').isAdmin;
const fn = require('path').basename(__filename);
const logger = require('../../../config/winston').logger;
const validateNumbers = require('../../../lib/objectValidator').validateNumbers;

router.get('/:num1/:num2', isAuth, function (req, res, next) {
    logger.debug(`[${fn}]: Request received. Check debug log for request details.`, req.params);
    const { error, value } = validateNumbers(req.params)
    let result = {},
        code = 200;

    if (error) {
        result = error.details;
        code = 400;
        logger.error(`[${fn}]: Request failed to pass validation. Please use real numbers or check the log for my info.`, error.details);

    } else {
        ({ num1, num2 } = value);
        result = {
            operation: "addition",
            augend: `${num1}`,
            addend: `${num2}`,
            sum: `${num1 + num2}`
        };
        logger.info(`[${fn}]: Successful ${result.operation} request: ${result.augend} + ${result.addend} = ${result.sum}.`)
    }

    return res.status(code).json(result);
});

module.exports = router;