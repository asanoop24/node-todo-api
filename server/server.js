var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {ToDo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

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


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
