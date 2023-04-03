const mongoose = require('mongoose');
const { genPassword, validPassword } = require('../lib/passwordUtils');

require('dotenv').config();

const conn = process.env.DB_STRING;
const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

const User = connection.model('User', UserSchema);

module.exports = connection;

