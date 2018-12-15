const mongoose = require('mongoose');

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
  steamID64: String, //should be unique but need to set it to empty string at start!
  profileName: String,
  imageUrl: String,
  profileUrl: String,
  apps: [{
    appId: Number,
    name: String,
    imageUrl: String,
    playtime: Number
  }]
});

UserSchema.statics.authenticate = (email, password, callback) => {
  User.findOne({
      email: email
    })
    .exec((err, user) => {
      if (err) {
        return callback(err);
      } else if (!user) {
        const error = new Error('User not found.');
        error.status = 401;
        return callback(error);
      }

      if (password === user.password) {
        return callback(null, user);
      }

      const error = new Error('Wrong password');
      error.status = 401;
      return callback(error);

    });
};

UserSchema.statics.updateSteamID = (id, steamID64, callback) => {
  User.findByIdAndUpdate(id, {
    "steamID64": steamID64
  }, (err, user) => {
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

UserSchema.statics.updateSteamCredentials = (id, userData, callback) => {
  User.findByIdAndUpdate(id, {
    steamLogin: userData.username,
    steamPassword: userData.password
  }, (err, user) => {

    if (err) {
      return callback(err);
    } else if (!user) {
      const eror = new Error('User not found.');
      error.status = 401;
      return callback(error);
    }
    return callback(null, user);
  })
}



UserSchema.statics.getParams = (id, params, callback) => {
  User.findById(id, (err, user) => {
    if (err) {
      return callback(err);
    } else if (!user) {
      const error = new Error('User not found!');
      error.status = 401;
      return callback(error);
    }

    const data = {};

    params.forEach((param) => {
      data[param] = user[param] || null;
    });

    return callback(null, data);
  })
}

const User = mongoose.model('User', UserSchema);
module.exports = User;