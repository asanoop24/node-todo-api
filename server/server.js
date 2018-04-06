const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {ToDo} = require('./models/todo');
var {User} = require('./models/user');
var config = require('./config/config');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//-----------------------------------------------------------------------------//
// POSTing a new ToDo to the todos collection
//-----------------------------------------------------------------------------//
app.post('/todos', (request, response) => {
  var todo = new ToDo({
    text: request.body.text
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
  var user = new User({
    name: request.body.name,
    email: request.body.email
  });
  console.log(user);
  user.save()
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
// GETting all the todos in the todos collection
//-----------------------------------------------------------------------------//
app.get('/todos', (request, response) => {
  ToDo.find()
  .then((todos) => {
    response.status(200).send({
      todos,
      status: 'Passed'
    });
  })
  .catch((error) => {
    response.status(400).send(error);
  });
});

//-----------------------------------------------------------------------------//
// GETting a specific todo in the todos collection by id
//-----------------------------------------------------------------------------//
app.get('/todos/:id', (request, response) => {
  var id = request.params.id;
  if(!ObjectID.isValid(id)) return response.status(404).send({error: 'Invalid Id'});

  ToDo.findById(id)
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
app.delete('/todos/:id', (request, response) => {
  var id = request.params.id;
  if(!ObjectID.isValid(id)) return response.status(404).send({error: 'Invalid Id'});

  ToDo.findByIdAndRemove(id)
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
app.patch('/todos/:id', (request, response) => {
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

  ToDo.findByIdAndUpdate(id, {$set: body}, {new: true})
  .then((todo) => {
    if(!todo) return response.status(404).send({error: 'Doc not found'});
    response.status(200).send(todo);
  })
  .catch((error) => {
    response.status(400).send(error);
  });


  // ToDo.findByIdAndRemove(id)
  // .then((todo) => {
  //   if(!todo) return response.status(404).send({error: 'Doc not found'});
  //   response.status(200).send(todo);
  // })
  // .catch((error) => {
  //   response.status(400).send(error);
  // });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


module.exports.app = app;
