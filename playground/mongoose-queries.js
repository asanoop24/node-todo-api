const {mongoose} = require('./../server/db/mongoose');
const {ToDo} = require('./../server/models/todo');

var id = '5ac3bdbbc1fdfd1850486b00';

ToDo.find(
  {_id: id}
)
.then((todos) => {
  if(todos) return console.log('Id not found');
  console.log(todos);
})
.catch((error) => {
  console.log(error.message);
});


ToDo.findOne({_id: id})
.then((todo) => {
  if(!todo) return console.log('Id not found');
  console.log(todo);
})
.catch((error) => {
  console.log(error.message);
});

ToDo.findById(id)
.then((todo) => {
  if(!todo) return console.log('Id not found');
  console.log(todo);
})
.catch((error) => {
  console.log(error.message);
});
