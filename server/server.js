var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {ToDo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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
  if(!ObjectID.isValid(id)) return response.status(404).send({});

  ToDo.findById(id)
  .then((todo) => {
    if(!todo) return response.status(404).send({});
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
