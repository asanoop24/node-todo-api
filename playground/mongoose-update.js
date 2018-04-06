const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {ToDo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

ToDo.findByIdAndUpdate('5ac546d23d2ebd2f684233f1', {text: 'test todo 2'})
.then((result) => {
  console.log(result);
})
.catch((error) => {
  console.log(error);
});
