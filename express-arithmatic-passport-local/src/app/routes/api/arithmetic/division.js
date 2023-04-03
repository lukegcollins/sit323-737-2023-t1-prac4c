const router = require('express').Router();
const fn = require('path').basename(__filename);
const logger = require('../../../config/winston').logger;
const validateNumbers = require('../../../lib/objectValidator').validateNumbers;

router.get('/:num1/:num2', function (req, res, next) {
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
            operation: "division",
            dividend: `${num1}`,
            divisor: `${num2}`,
            quotient: `${num1 / num2}`
        };
        logger.info(`[${fn}]: Successful ${result.operation} request: ${result.dividend} / ${result.divisor} = ${result.quotient}.`)
    }

    return res.status(code).json(result);
});

module.exports = router;