const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/steam');
const db = mongoose.connection;

// Middlewares object
const mid = require('./app/middlewares/middlewares');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app/public')));


// Routes without authentication

const routes = require('./app/routes/index');
const login = require('./app/routes/login');
//const logout = require('./app/routes/logout');
const register = require('./app/routes/register');

app.use('/', routes);
app.use('/login', login);
app.use('/register', register);

// Routes after middleware authentication
app.use(mid.requiresLogin);
const profile = require('./app/routes/profile');
app.use('/profile', profile);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
