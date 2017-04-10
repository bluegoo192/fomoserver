var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function encrypt(password) {
  return password; //todo: add actual encryption
}

var userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  encrypted: Boolean,
  socialnetworks: Array,
  birthdate: { type: Date, required: true },
  creation_date: Date,
  backups: Array,
  friends: Array,
  invitations: Array
  //store events in a separate databse
});

userSchema.methods.encrypt = function(password) {
  this.encrypted = true;
  return password;
}

userSchema.pre('save', function(next) {
  if (!this.encrypted) this.password = this.encrypt(this.password);
  next();
})

var User = mongoose.model("User", userSchema, "users");

module.exports = User;
