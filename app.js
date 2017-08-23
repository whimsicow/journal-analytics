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

const db = require('./db');
const index = require('./routes/index');
const teammembers = require('./routes/teammembers');
const users = require('./routes/users');
const login = require('./routes/login');
const logout = require('./routes/logout');
const api = require('./routes/api');
const eventlist = require('./routes/eventrendering');


require('dotenv').config();
const app = express();

/************************************************************ VIEW ENGINE SETUP *************/
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}))
app.set('view engine', 'hbs');


/************************************************************* GOOGLE OAUTH *************/
passport.serializeUser(function(email, done) {
    // saves user's email under req.session.passport.user
    done(null, email);
});

passport.deserializeUser(function(email, done) {
  // could get entire profile during deserialization, right now just returning email
    // db.one(`select * from users where email = '${email}'`)
    //     .then((result) => {
    //         done(null, result);
    //     })
    done(null, email);
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
    function(accessToken, refreshToken, profile, done) {
        var firstname = profile.name.givenName;
        firstname = firstname.replace("'", "''");
        var surname = profile.name.familyName;
        surname = surname.replace("'", "''");
        db.one(`
        insert into users (email, firstname, surname)
        values ('${profile.emails[0].value}', '${firstname}', '${surname}')
        on conflict (email)
        do update set (firstname, surname) = ('${firstname}', '${surname}')
        where users.email = '${profile.emails[0].value}';
        select * from users where email = '${profile.emails[0].value}';
      `)
            .then((result) => {
                done(null, profile.emails[0].value);
            })
}))
    

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
app.use('/teammembers', teammembers);
app.use('/eventlist', eventlist);
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
