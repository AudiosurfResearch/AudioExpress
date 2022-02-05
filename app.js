var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var as1apiRouter = require('./routes/as1_api');
const { json } = require('body-parser');
var bodyParser = require('body-parser');
let dotenv = require('dotenv').config();

var app = express();

app.disable('x-powered-by');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/as', as1apiRouter);
//Why is this a thing
app.use('//as', as1apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;