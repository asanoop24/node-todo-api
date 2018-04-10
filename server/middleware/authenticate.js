var {User} = require('./../models/user');
var _ = require('lodash');

var authenticate = (request, response, next) => {
  var token = request.header('x-auth');
  User.findByToken(token)
  .then((user) => {
    if(!user) return Promise.reject();
    // var user = _.pick(user, ['name', 'email']);
    request.user = user;
    request.token = token;
    next();
  })
  .catch((error) => {
    response.status(401).send(error);
  });
};

module.exports.authenticate = authenticate;
