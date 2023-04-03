const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

// Avaiable Routes for this directory
router.use('/api', require('./api'));

// POST REQUESTS
router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }));
router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.pw);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.uname,
        hash: hash,
        salt: salt,
        admin: true
    });

    newUser.save()
        .then((user) => {
            console.log(user);
        });

    res.redirect('/login');
});

// GET REQUESTS
router.get('/', (req, res, next) => {
    res.send(
        '<h1 style="text-align: center;"><strong>Home Page</strong></h1>\
        <p style="text-align: center;"><strong>To use the arithmetic functions you will need to </strong><strong><a href="./login">Login</a> or <a href="./register">Register</a> to continue.</strong></p>\
        <h3 style="text-align: center;"><strong><a href="./api/arithmetic/addition/1/1">Addition</a>\
        <br /><a href="./api/arithmetic/subtraction/1/1">Subtraction</a>\
        <br /><a href="./api/arithmetic/multiplication/1/1">Multiplication</a>\
        <br /><a href="./api/arithmetic/division/1/1">Division</a>\
        <br /><a href="./api/arithmetic/modulation/1/1">Modulation</a></strong></h3>'
    );
});
router.get('/login', (req, res, next) => {

    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="uname">\
    <br>Enter Password:<br><input type="password" name="pw">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="uname">\
                    <br>Enter Password:<br><input type="password" name="pw">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
});

router.get('/protected-route', isAuth, (req, res, next) => {
    res.send('You made it to the route.');
});

router.get('/admin-route', isAdmin, (req, res, next) => {
    res.send('You made it to the admin route.');
});

// Visiting this route logs the user out
router.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});
module.exports = router;