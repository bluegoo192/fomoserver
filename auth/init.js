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
var createHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
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
  passport.use('signup', new LocalStrategy(
    { passReqToCallback: true },
    function(req, email, password, done) {
      findOrCreateUser = function() {
        database.User.findOne({'email':email}, function(err, user) {
          if (err) {
            console.log('Error in signup: '+err);
            return done(err);
          }
          if (user) {
            console.log('User exists already');
            return done(null, false);
          } else {
            var newUser = database.User(req.body);
            newUser.password = createHash(newUser.password);
            newUser.encrypted = true;//we are going to encrypt manually for now
            newUser.creation_date = new Date();
            newUser.save(function(err) {
              if (err) {
                console.log('Error saving user: '+err);
                throw err;
              }
              console.log('Successfully registered user: '+newUser.email);
              return done(null, newUser);
            });
          }
        });
      }
      process.nextTick(findOrCreateUser);
    })
  );
}

module.exports = init
