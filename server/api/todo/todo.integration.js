'use strict';

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';

var newTodo;

describe('Todo API:', function() {
  var user;
  var token;

  // Clear users before testing
  before(function(done) {
    User.removeAsync().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password',
        todo: [{ 
                name: 'Fake Todo List 1',
                items: [
                    { name: 'Fake Item (Complete)',
                      completed: true },
                    { name: 'Fake Item (Incomplete)',
                      completed: false }
                ]
              },
            { 
                name: 'Fake Todo List 2',
                items: [
                    { name: 'Fake Item (Incomplete)',
                      completed: false },
                    { name: 'Fake Item (Complete)',
                      completed: true }
                ]
              }]
      });

      user.saveAsync().then(function() {
          request(app)
          .post('/auth/local')
          .send({
            email: 'test@example.com',
            password: 'password'
          })
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            token = res.body.token;
            done();
          });
      });
    });
  });

  // Clear users after testing
  after(function() {
    return User.removeAsync();
  });

  describe('GET /api/todo', function() {
    var todos;

    beforeEach(function(done) {
      request(app)
        .get('/api/todo')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          todos = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      todos.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/todo', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/todo')
        .send({
          name: 'New Todo'
        })
        .set('authorization', 'Bearer ' + token)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newTodo = res.body;
          done();
        });
    });

    it('should respond with the newly created todo', function() {
      newTodo.name.should.equal('New Todo');
    });

  });

  describe('GET /api/todo/:id', function() {
    var todo;

    beforeEach(function(done) {
      request(app)
        .get('/api/todo/' + newTodo._id)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          todo = res.body;
          done();
        });
    });

    afterEach(function() {
      todo = {};
    });

    it('should respond with the requested todo', function() {
      todo.name.should.equal('New Todo');
    });

  });

  describe('PUT /api/todo/:id', function() {
    var updatedTodo;

    beforeEach(function(done) {
      request(app)
        .put('/api/todo/' + newTodo._id)
        .set('authorization', 'Bearer ' + token)
        .send({
          name: 'Updated Todo',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTodo = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTodo = {};
    });

    it('should respond with the updated todo', function() {
      updatedTodo.name.should.equal('Updated Todo');
    });

  });

  describe('DELETE /api/todo/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/todo/' + newTodo._id)
        .set('authorization', 'Bearer ' + token)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when todo does not exist', function(done) {
      request(app)
        .delete('/api/todo/' + newTodo._id)
        .set('authorization', 'Bearer ' + token)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
