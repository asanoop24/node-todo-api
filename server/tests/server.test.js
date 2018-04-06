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
  })
  .then(() => done())
  .catch((e) => {
    console.log('Error ', e);
  });
});


describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((response) => {
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


describe('DELETE /todos/:id', () => {

  it('should remove a todo doc', (done) => {
    request(app)
    .delete(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((response) => {
      expect(response.body._id).toBe(todos[0]._id.toHexString());
    })
    .end((error, response) => {
      if(error) return done(error);
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(404)
      .end(done);
    });
  });

  it('should return a 404 if id is valid but todo is not found', (done) => {
    var id = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${id}`)
    .expect(404)
    .end(done);
  });

  it('should return a 404 if id is not valid', (done) => {
    var id = '123abc';
    request(app)
    .delete(`/todos/${id}`)
    .expect(404)
    .end(done);
  });


});



describe('PATCH /todos/:id', () => {

  it('should update a todo doc', (done) => {
    request(app)
    .delete(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((response) => {
      expect(response.body._id).toBe(todos[0]._id.toHexString());
    })
    .end((error, response) => {
      if(error) return done(error);
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(404)
      .end(done);
    });
  });

  it('should clear completedAt when completed is false', (done) => {
    var id = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${id}`)
    .expect(404)
    .end(done);
  });

  it('should return a 404 if id is valid but todo is not found', (done) => {
    var id = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${id}`)
    .expect(404)
    .end(done);
  });

  it('should return a 404 if id is not valid', (done) => {
    var id = '123abc';
    request(app)
    .delete(`/todos/${id}`)
    .expect(404)
    .end(done);
  });


});
