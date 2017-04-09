const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

var database = require('../database/mongooseclient.js');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  database.findUserById(id, function(err, user) {
    done(err, user);
  });
});

const user = {
  username: 'test-user',
  password: 'test-password',
  id: 1
}

passport.use(new LocalStrategy(
  function(username, password, done) {
    findUser(username, function (err, user) {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false)
      }
      if (password !== user.password  ) {
        return done(null, false)
      }
      return done(null, user)
    })
  }
))
