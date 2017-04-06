var mongoose = require('mongoose');
var User = require('./models/user.js');

mongoose.connect('mongodb://eventcreator:eventcreator@ds153400.mlab.com:53400/fomo');
//mongoose.connect('mongodb://reader:reader@ds153400.mlab.com:53400/fomo');

var client = {}

client.createUser = function(data) {
  console.log("Creating user...");
  var newUser = User({
    name: data.name,
    email: data.email,
    password: data.password,
    encrypted: false,
    socialnetworks: data.social,
    birthdate: data.birthdate,
    creation_date: new Date
  });
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

module.exports = client;
