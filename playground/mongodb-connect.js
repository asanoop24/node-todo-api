// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (error, client) => {

  if(error){
    console.log('Unable to connect to MongoDB Server');
    return;
  }

  console.log('Successfuly Connected to MongoDB Server');
  const db = client.db('ToDoApp');

  // db.collection('ToDos').insertOne({
  //   text: 'Walk the dog',
  //   completed: false
  // }, (err, res) => {
  //   if(err){
  //     console.log('Unable to Insert ToDo');
  //     return;
  //   }
  //   console.log(JSON.stringify(res.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Anoop Sharma',
  //   age: 25,
  //   location: 'India'
  // }, (err, res) => {
  //   if(err){
  //     console.log('Unable to Insert User');
  //     return;
  //   }
  //   console.log(JSON.stringify(res.ops, undefined, 2));
  // });

  client.close()

});
