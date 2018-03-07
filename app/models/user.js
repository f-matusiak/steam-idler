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
        const error = new Error('User not found.');
        error.status = 401;
        return callback(error);
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

UserSchema.statics.updateSteamID = (id, steamID64, callback) => {
  User.findByIdAndUpdate(id, { "steamID64": steamID64 }, (err, user) => {
    if (err) {
      return callback(err);
    } else if (!user) {
      const eror = new Error('User not found.');
      error.status = 401;
      return callback(error);
    }
    return callback(null, user);
  })
};

UserSchema.statics.getPublic = (id, callback) => {
  User.findById(id, (err, user) => {
    if (err) {
      return callback(err);
    } else if (!user) {
      const error = new Error('User not found!');
      error.status = 401;
      return callback(error);
    }
    const data = {
      username: user.username,
      apps: user.apps,
      imageUrl: user.imageUrl
    };
    return callback(null, data);
  })
};

UserSchema.statics.getPrivate = (id, callback) => {
  User.findById(id, (err, user) => {
    if (err) {
      return callback(err);
    } else if (!user) {
      const error = new Error('User not found!');
      error.status = 401;
      return callback(error);
    }
    const data = {
      username: user.username,
      steamID64: user.steamID64,
      apps: user.apps,
      imageUrl: user.imageUrl
    };
    return callback(null, data);
  })
};

const User = mongoose.model('User', UserSchema);
module.exports = User;