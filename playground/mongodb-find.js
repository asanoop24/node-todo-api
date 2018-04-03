const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (error, client) => {

  if(error){
    console.log('Unable to connect to MongoDB Server');
    return;
  }

  console.log('Successfuly Connected to MongoDB Server');
  const db = client.db('ToDoApp');

  db.collection('ToDos').find({text: 'Walk the dog'}).toArray()
  .then((data)=>{
    console.log(data);
  })
  .catch((error)=>{
    console.log(error);
  });

  client.close()

});
