const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
  // All users
  name: { type: String },
  email: { type: String },
  password: { type: String },
  photoAddress: { type: String },

// Login with Facebook users
  facebookID: { type: String },

  // Login with Google users
  googleID: { type: String }

});

userSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);

module.exports = User;
