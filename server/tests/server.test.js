const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');


const todos = [{
  _id: new ObjectID(),
  text: 'test todo 1'
}, {
  _id: new ObjectID(),
  text: 'test todo 2'
}];

beforeEach((done) => {
  ToDo.remove({}).then(() => {
    return ToDo.insertMany(todos);
  }).then(() => done());
  // .catch((e) => {
  //   console.log('Error ', e);
  // })
  // ;
});


describe('GET /todos/:id', () => {
  console.log(`/todos/${todos[0]._id.toHexString()}`);

  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((response) => {
      console.log('body is ', response.body.text);
      expect(response.body.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return a 404 if id is valid but todo is not found', (done) => {
    var id = new ObjectID().toHexString();

    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .end(done);
  });

  it('should return a 404 if id is not valid', (done) => {
    var id = '123abc';
    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .end(done);
  });


});
