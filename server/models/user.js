const mongoose = require('mongoose');
const validator = require('validator');
const {sign, verify} = require('jsonwebtoken');
const _ = require('lodash');
const expect = require('expect');
const bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 1,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = sign({_id: user._id.toHexString(), access: access}, process.env.JWT_SECRET).toString();
  user.tokens = user.tokens.concat({
    access: access,
    token: token
  });

  return user.save()
  .then(() => {
    return token;
  })
};


UserSchema.methods.removeToken = function(token) {
  var user = this;
  // console.log(user);
  return user.update({
    $pull: {tokens: {token: token}}
  });
};




UserSchema.statics.findByToken = function(token) {
  var User = this;

  try {
    var decoded = verify(token, process.env.JWT_SECRET);
  } catch(e){
    return Promise.reject(e);
  }


    return User.findOne({
      _id: decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    })
};

UserSchema.statics.findByEmailAndPassword = function(email, password) {
  var User = this;

  return User.findOne({email: email})
  .then((user) => {

    if(!user) return Promise.reject('Invalid Email');
    return new Promise((resolve, reject) => {

      bcrypt.compare(password, user.password, (error, result) => {
        if(result){
          resolve(user);
        }else{
          reject('Invalid Password');
        }
      });

    });

  })
  .catch((error) => {
    // console.log(error);
    return Promise.reject(error);
  });

};





UserSchema.pre('save', function(next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash;
        next();
      });
    });
  }else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports.User = User;
