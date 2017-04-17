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
    if (err) {
      console.log("Couln't save "+err);
      return false;
    };
    console.log("Successfully created "+name+": "+doc._id);
  });
  return true;
}

client.validateUser = function(user) {
  return user;
}

client.createUser = async function(data) {
  var status = { };
  var query = await User.find({'email':data.email}, function(err,user) {
    if (err) {
      status['success'] = false;
      status['message'] = "weird error when checking to see if user already exists";
    }
    if (user) {
      status['success'] = false;
      status['message'] = "User with email "+data.email+" already exists";
    } else {
      status['success'] = this.create(data, User, "user", function(doc) {
        doc.encrypted = false;
        doc.creation_date = new Date();
      });
      if (status.success) status['message'] = "Created user with email: "+data.email;
      if (!status.success) status['message'] = "Failed to create user";
    }
  }).exec();
  return status;
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

client.getEvents = async function(user, location, handler) {
  var status = {};
  status['message'] = "something's wrong; you should NOT be seeing this!";
  var query = await Event.find({}, function(err,events) {
    if (err) {
      status['success'] = false;
      status['message'] = "weird error";
    }
    if (events) {
      status['success'] = true;
      status['message'] = "Found something?";
      status['data'] = events;
    } else {
      status['success'] = false;
      status['message'] = "Couldn't find any events";
    }
  }).exec();
  return status;
}

module.exports = client;
