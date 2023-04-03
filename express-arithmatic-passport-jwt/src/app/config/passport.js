const dotenv = require("dotenv").config();
const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;
const { genPassword, validPassword } = require('../lib/passwordUtils');

const customFields = {
    usernameField: 'uname',
    passwordField: 'pw'
};

passport.use(
    'signup',
    new LocalStrategy(
        customFields,
        async (username, password, done) => {
            try {
                const saltHash = genPassword(password);

                const salt = saltHash.salt;
                const hash = saltHash.hash;

                const newUser = new User({
                    username: username,
                    hash: hash,
                    salt: salt,
                    admin: false
                });

                await newUser.save()
                    .then((user) => {
                        console.log(user);
                    });

                return done(null, newUser);
            } catch (error) {
                console.log(error)
                done(error);
            }
        }
    )
);

passport.use(
    'login',
    new LocalStrategy(
        customFields,
        async (username, password, done) => {
            try {
                const user = await User.findOne({ username });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await validPassword(password, user.hash, user.salt)

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter()
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});

