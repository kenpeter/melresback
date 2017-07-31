//
const config = require('./config');
//
const mongoose = require('mongoose');
//
mongoose.Promise = require('bluebird');
//
const conn = mongoose.createConnection(config.database);

module.exports = conn;
