const dotenv = require("dotenv").config();
const fn = require('path').basename(__filename);
const winston = require('winston');
const { createLogger, format, transports } = winston
const { combine, colorize, json, metadata, printf, prettyPrint, timestamp } = format;

const consoleFormat = printf(info => `${info.timestamp} ${info.level} ${info.message}`)
const logFormat = printf(info => `${info.timestamp} ${info.level} ${info.message} ${info.metadata}`)

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        metadata({ fillExcept: ['message', 'level', 'timestamp'] })
    ),
    transports: [
        new transports.File({ filename: 'error.log', dirname: `${process.env.LOG_DIR}`, level: 'error', format: combine(json()) }),
        new transports.File({ filename: 'info.log', dirname: `${process.env.LOG_DIR}`, level: 'info', format: combine(json()) }),
        new transports.File({ filename: 'debug.log', dirname: `${process.env.LOG_DIR}`, level: 'debug', format: combine(json(), prettyPrint()) })
    ],

    exitOnError: false
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({ level: 'debug', format: combine(colorize(), consoleFormat) }));
}

module.exports = {
    logger
}