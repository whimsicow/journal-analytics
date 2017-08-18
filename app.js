const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const index = require('./routes/index');
const users = require('./routes/users');
const login = require('./routes/login');

const db = require('./db');
const logout = require('./routes/logout');
const api = require('./routes/api');

require('dotenv').config();


const app = express();



// view engine setup
=======
/************************************************************ VIEW ENGINE SETUP *************/

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}))
app.set('view engine', 'hbs');


/************************************************************* GOOGLE OAUTH *************/
passport.serializeUser(function(user, done) {
  // placeholder for custom user serialization
  // null is for errors
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  // placeholder for custom user deserialization.
  // maybe you are going to get the user from mongo by id?
  // null is for errors
  done(null, obj);
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
    function(accessToken, refreshToken, profile, done) {
            done(null, profile);
}))
        // process.nextTick(function() {

        //     // try to find the user based on their google id
        //     User.findOne({ 'google.email' : profile.emails[0].value }, function(err, user) {
        //         if (err)
        //             return done(err);

        //         if (user) {

        //             // if a user is found, log them in
        //             return done(null, user);
        //         } else {
        //             // if the user isnt in our database, create a new user
        //             var newUser = new User();

        //             // set all of the relevant information
        //             newUser.google.email = profile.emails[0].value;
        //             newUser.google.firstname  = profile.name.givenName;
        //             newUser.googe.surname = profile.name.familyName;
        //             newUser.google.photo = req.user.photos[0]['value']; 

        //             // save the user
        //             newUser.save(function(err) {
        //                 if (err)
        //                     throw err;
        //                 return done(null, newUser);
        //             });
        //         }
        //     });
        // });
    

// Express and Passport Session
app.use(session({
    secret: 'asdfjkl;',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


/************************************************************ MIDDLEWARE *******/
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/************************************************************ ROUTER *******/
app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/logout', logout);
app.use('/api', api);


app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', {
        successRedirect: '/users',
        failureRedirect: '/login',
        failureFlash: true }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
