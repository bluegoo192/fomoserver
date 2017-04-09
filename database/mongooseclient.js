var mongoose = require('mongoose');
var User = require('./models/user.js');
var Event = require('./models/event.js');

mongoose.connect('mongodb://eventcreator:eventcreator@ds153400.mlab.com:53400/fomo');
var client = {}

client.user = User;

client.create = function(data, model, name, handler) {
  var doc = model(data);
  handler(doc);//run the extra sht
  var error = doc.validateSync();
  if (error) {
    console.log("ERROR VALIDATING "+name+": "+doc._id);
    return error;
  }
  doc.save(function(err) {
    if (err) throw err;
    console.log("Successfully created "+name+": "+doc._id);
  });
  return true;
}

client.validateUser = function(user) {
  return user;
}

client.createUser = function(data) {
  return this.create(data, User, "user", function(doc) {
    doc.encrypted = false;
    doc.creation_date = new Date();
  });
}

client.findUserById = function(id, handler) {
  User.findById(id, function(err, user) {
    handler(err, user);
  });
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
  return this.create(data, Event, "event", (doc) => {
    doc.creator = this.validateUser(user);
    doc.creation_date = new Date();
  });
}

client.getEvents = function(user, location, handler) {
  console.log("getEvents: " + user);
  handler(user);
}

module.exports = client;
