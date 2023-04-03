const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./app/routes');
var securedRoutes = require('./app/routes-secured');
const connection = require('./app/config/database');
const logger = require('./app/config/winston').logger;
const fn = require('path').basename(__filename);

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo');

// Create the Express App
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up the Express Session
//const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });
const sessionStore = MongoStore.create({ mongoUrl: process.env.DB_STRING, collectionName: 'sessions' });

app.use(session({
    secret: process.env.SESSIONS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));

// Set up the Passport middleware
require('./app/config/passport');


app.use(passport.initialize());
app.use('/user', passport.authenticate('jwt', securedRoutes));
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

// Set up the routes
app.use(routes);

// Handle errors.
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});

// Start the server
var server = app.listen(process.env.APP_PORT || 3000, function () {
    logger.info(`[${fn}]: Server Started on port ${server.address().port} in ${process.env.NODE_ENV} mode.`);

    if (process.env.NODE_ENV !== 'production') {
        logger.info(`[${fn}]: INFO level console logging enabled.`);
        logger.debug(`[${fn}]: DEBUG level console logging enabled.`);
        logger.error(`[${fn}]: ERROR level console logging enabled.`);
    }
});