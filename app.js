const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

mongoose.connect('mongodb://localhost/steam');
const db = mongoose.connection;

// Middlewares object
const mid = require('./middlewares/middlewares');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'd64a84713f7f86287c34d9d394aa56975ba3f182',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// Routes
const routes = require('./routes/index');
const games = require('./routes/games');
const login = require('./routes/login');
const logout = require('./routes/logout');
const register = require('./routes/register');

app.use('/', routes);
app.use('/games', games);
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);
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
