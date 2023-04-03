const Joi = require('joi');
const fn = require('path').basename(__filename);
const logger = require('../config/winston').logger;

// Validator Handler
const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

// Schema for validating real numbers in a request query.
const validArithmeticValues = Joi.object({
    num1: Joi.number().required(),
    num2: Joi.number().required()
});

// Schema for validating User IDs in a request query.
const validRequestUserIdValue = Joi.object().keys({
    id: Joi.number().required()
});

// Schema for validating User objects.
const validUserObjectValues = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    isAdmin: Joi.boolean().required()
})

const validateNumbers = validator(validArithmeticValues);
const validateUserId = validator(validRequestUserIdValue);
const validateUser = validator(validUserObjectValues);


module.exports.validateUserId = validateUserId;
module.exports.validateNumbers = validateNumbers;
module.exports.validateUser = validateUser;