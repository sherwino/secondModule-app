const express            = require('express');
const path               = require('path');
const favicon            = require('serve-favicon');
const logger             = require('morgan');
const cookieParser       = require('cookie-parser');
const bodyParser         = require('body-parser');
const expressLayouts     = require('express-ejs-layouts');
const passport           = require('passport');
const LocalStrategy      = require('passport-local').Strategy;
const User               = require('./models/user');
const bcrypt             = require('bcrypt');
const session            = require('express-session');
const mongoStore         = require('connect-mongo')(session);
const mongoose           = require('mongoose');
const flash              = require('connect-flash');
const multer             = require('multer');

require ('dotenv').config();

// Tell node to run the code contained in this file
// (this sets up passport and our strategies)
require('./config/passport-config.js');

mongoose.connect('mongodb://localhost/secondmoduleApp');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);

// default value for title local
app.locals.title = 'CRUD APPLICATION';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secondmodule-app',
  resave: true,
  saveUninitialized: true,

}));

// These need to come AFTER the session middleware
app.use(passport.initialize());
app.use(passport.session());
// ... and BEFORE our routes

app.use(flash());

app.use((req, res, next) => {
  if (req.user) {
    res.locals.currentUserInfo = req.user;
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }

  next();
});

//-------------------ROUTES HERE------------------------------------
const index = require('./routes/index');
console.log('HOME PAGE');
app.use('/', index);

const authRoutes = require('./routes/auth');
console.log('auth Routes');
app.use('/', authRoutes);

const myPostRoutes = require('./routes/post-route.js');
console.log('myPostRoutes');
app.use('/', myPostRoutes);

// const myUserRoutes = require('./routes/user-routes.js');
// app.use('/', myUserRoutes);
//
//-------------------------------------------------------------------


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
