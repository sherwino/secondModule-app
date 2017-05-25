const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
  // All users
  name: { type: String },
  email: { type: String },
  password: { type: String },
  role: {
    type: String,
    enum: [ 'normal user', 'admin' ],
    //^basically saying it's either one or the other.
    default: 'normal user'
  },

// Login with Facebook users
  facebookID: { type: String },

  // Login with Google users
  googleID: { type: String }

});

userSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);

module.exports = User;
