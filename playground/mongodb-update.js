const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (error, client) => {

  if(error){
    console.log('Unable to connect to MongoDB Server');
    return;
  }

  console.log('Successfuly Connected to MongoDB Server');
  const db = client.db('ToDoApp');

  // db.collection('ToDos').UpdateMany({completed: false})
  // db.collection('ToDos').UpdateOne({completed: false})
  db.collection('Users').findOneAndUpdate(
    {
      name: 'Anoop Sharma'
    },
    {
      $set: {name: 'Anil Sharma'},
      $inc: {age: 4}
    },
    {
      returnOriginal: false
    }
  )
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log('Error: ', error);
  })
  ;

  client.close()

});
