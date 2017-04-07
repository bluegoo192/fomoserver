var mongoose = require('mongoose');
var User = require('./models/user.js');

mongoose.connect('mongodb://eventcreator:eventcreator@ds153400.mlab.com:53400/fomo');
var client = {}

client.createUser = function(data) {
  console.log("Creating user...");
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

client.createEvent = function(data, handler) {
  console.log("data: "+data);
  handler(data);
}

module.exports = client;
