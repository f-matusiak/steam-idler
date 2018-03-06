const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  steamLogin: String,
  steamPassword: String,
  confirmation: Number,
  steamID64: {
    type: String,
    unique: true
  },
  profileName: String,
  imageUrl: String,
  apps: [{ appId: Number, name: String }]
});

UserSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

UserSchema.statics.authenticate = (email, password, callback) => {
  User.findOne({ email: email })
    .exec((err, user) => {
      if (err) {
        return callback(err);
      } else if (!user) {
        const err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
};

const User = mongoose.model('User', UserSchema);
module.exports = User;