require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {ToDo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//-----------------------------------------------------------------------------//
// POSTing a new ToDo to the todos collection
//-----------------------------------------------------------------------------//
app.post('/todos', authenticate, (request, response) => {
  var todo = new ToDo({
    text: request.body.text,
    _creator: request.user._id
  });
  todo.save()
  .then((doc) => {
    response.status(200).send(doc);
    console.log(doc);
  })
  .catch((error) => {
    response.status(400).send(error);
    console.log(error.message);
  });
});

//-----------------------------------------------------------------------------//
// POSTing a new User to the users collection
//-----------------------------------------------------------------------------//
app.post('/users', (request, response) => {
  // var user = new User({
  //   name: request.body.name,
  //   email: request.body.email,
  //   password: request.body.password
  // });
  var body = _.pick(request.body, ['name', 'email', 'password']);
  var user = new User(body);
  user.generateAuthToken()
  .then((token) => {
    response.status(200).header('x-auth', token).send(user);
  })
  .catch((error) => {
    response.status(400).send(error);
  });
});


//-----------------------------------------------------------------------------//
// POSTing a login User to the users collection
//-----------------------------------------------------------------------------//
app.post('/users/login', (request, response) => {
  var body = _.pick(request.body, ['email', 'password']);
  var user = new User(body);
  User.findByEmailAndPassword(user.email, user.password)
  .then((user) => {
    return user.generateAuthToken();
  })
  .then((token) => {
    response.header({'x-auth': token}).status(200).send(user);
  })
  .catch((error) => {
    console.log(error);
    response.status(400).send(error);
  });

});

//-----------------------------------------------------------------------------//
// DELETing a token for User in the users collection
//-----------------------------------------------------------------------------//
app.delete('/users/me/token', authenticate, (request, response) => {
  var user = request.user;
  user.removeToken(request.token)
  .then((result) => {
    response.status(200).send();
  })
  .catch((error) => {
    response.status(400).send(error);
  });
});
//-----------------------------------------------------------------------------//
// POSTing a new User to the users collection
//-----------------------------------------------------------------------------//
app.get('/users/me', authenticate, (request, response) => {
  response.send(request.user);
});


//-----------------------------------------------------------------------------//
// GETting all the todos in the todos collection
//-----------------------------------------------------------------------------//
app.get('/todos', authenticate, (request, response) => {
  ToDo.find({_creator: request.user._id})
  .then((todos) => {
    response.status(200).send(todos);
    // console.log(todos);
  })
  .catch((error) => {
    // console.log(error);
    response.status(400).send(error);
  });
});

//-----------------------------------------------------------------------------//
// GETting a specific todo in the todos collection by id
//-----------------------------------------------------------------------------//
app.get('/todos/:id', authenticate, (request, response) => {
  var id = request.params.id;
  // console.log(request.user);
  if(!ObjectID.isValid(id)) return response.status(404).send({error: 'Invalid Id'});

  ToDo.findOne({_id:id, _creator:request.user._id})
  .then((todo) => {
    if(!todo) return response.status(404).send({error: 'Doc not found'});
    response.status(200).send(todo);
  })
  .catch((error) => {
    response.status(400).send(error);
  });
});

//-----------------------------------------------------------------------------//
// DELETE a specific todo in the todos collection by id
//-----------------------------------------------------------------------------//
app.delete('/todos/:id', authenticate, (request, response) => {
  var id = request.params.id;
  if(!ObjectID.isValid(id)) return response.status(404).send({error: 'Invalid Id'});

  ToDo.findOneAndRemove({_id:id, _creator:request.user._id})
  .then((todo) => {
    if(!todo) return response.status(404).send({error: 'Doc not found'});
    response.status(200).send(todo);
  })
  .catch((error) => {
    response.status(400).send(error);
  });
});


//-----------------------------------------------------------------------------//
// PATCH a specific todo in the todos collection by id
//-----------------------------------------------------------------------------//
app.patch('/todos/:id', authenticate, (request, response) => {
  var id = request.params.id;
  var body = _.pick(request.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) return response.status(404).send({error: 'Invalid Id'});
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }
  else{
    body.completed = false;
    body.completedAt = null;
  }

  ToDo.findOneAndUpdate({_id:id, _creator:request.user._id}, {$set: body}, {new: true})
  .then((todo) => {
    if(!todo) return response.status(404).send({error: 'Doc not found'});
    response.status(200).send(todo);
  })
  .catch((error) => {
    response.status(400).send(error);
  });

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


module.exports.app = app;
