const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {ToDo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

ToDo.findOneAndRemove({text: 'Some Random Text'})
.then((result) => {
  console.log(result);
})
.catch((error) => {
  console.log(error);
});
