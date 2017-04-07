var mongoose = require('mongoose');
var User = require('./models/user.js');
var Event = require('./models/event.js');

mongoose.connect('mongodb://eventcreator:eventcreator@ds153400.mlab.com:53400/fomo');
var client = {}

client.validateUser = function(user) {
  return user;
}

client.createUser = function(data) {
  var newUser = User(data);
  newUser.encrypted = false;
  newUser.creation_date = new Date();
  var error = newUser.validateSync();
  if (error) {
    console.log("ERROR VALIDATING USER: " + newUser.name);
    console.log(error);
    return error;
  }
  newUser.save(function(err) {
    if (err) throw err;
    console.log("Successfully created user: "+newUser.name);
  });
  return true;
}

client.findUserForLogin = function(data, handler) {
  User.find({ email: data.email }, function(err, user) {
    if (err) {
      return false;
    }
    handler(user);
  });
}

client.createEvent = function(data, user) {
  console.log("createEvent: "+data);
  var newEvent = Event(data);
  newEvent.creator = this.validateUser(user);
  newEvent.creation_date = new Date();
  var error = newEvent.validateSync();
  if (error) {
    console.log("ERROR VALIDATING EVENT: "+newEvent.name);
    console.log(error);
    return error;
  }
  newEvent.save(function(err) {
    if (err) throw err;
    console.log("Successfully created event: "+newEvent.name);
  });
  return true;
}

client.getEvents = function(user, location, handler) {
  console.log("getEvents: " + user);
  handler(user);
}

module.exports = client;
