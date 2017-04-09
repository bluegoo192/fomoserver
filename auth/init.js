const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt-nodejs');

var database = require('../database/mongooseclient.js');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  database.findUserById(id, function(err, user) {
    done(err, user);
  });
});
var isValidPassword = function(user, password) {
  return bcrypt.compareSync(password, user.password);
}

function init() {
  passport.use('login', new LocalStrategy({
      passReqToCallback: true
    },
    function(req, email, password, done) {
      database.user.findOne({ 'email': email }, function(err, user) {
        if (err) return done(err);
        if (!user) {
          console.log('User not found with email'+email);
          return done(null, false);
        }
        if (!isValidPassword(user, password)) {
          console.log('Invalid password');
          return done(null, false);
        }
        return done(null, user);
      });
    }
  ));
}

module.exports = init
