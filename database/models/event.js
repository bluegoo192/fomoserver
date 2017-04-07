var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  name: { type: String, required: true },
  creator: { type: String, required: true },
  admins: Array,
  invitees: Array,
  publicity: {
    type: String,
    required: true,
    enum: ['PUBLIC', 'FRIENDS', 'INVITEES']
  },
  start: { type: Date, required: true},
  end: { type: Date, required: true},
  description: String,
  rating: Number,
  image_url: String,
  location: String,
  last_mod: Date,
  posts: { type: Array, default: [] }
  //store posts in a separate databse
});

eventSchema.methods.sendInvites = function() {
  console.log("sendInvites stub for "+this.name);
}

userSchema.pre('save', function(next) {
  this.last_mod = new Date();
  next();
})


var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
