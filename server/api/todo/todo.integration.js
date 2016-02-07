'use strict';

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';

var newTodo;
var newTodoItem;

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

  //Index todo lists
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

  //Create new todo list
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

  //Query one todo list by id
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

  //Update todo list
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
    
  //Add item to todo list post('/:id')
  describe('POST /api/todo/:id', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/todo/' + newTodo._id)
        .send({
          name: 'New Todo Item',
          completed: false
        })
        .set('authorization', 'Bearer ' + token)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newTodoItem = res.body;
          done();
        });
    });

    it('should respond with the newly created todo list item', function() {
      newTodoItem.name.should.equal('New Todo Item');
      newTodoItem.completed.should.equal(false);
    });

  });
    
  //Update todo list item
  describe('PUT /api/todo/:id/:item_id', function() {
    var updatedTodoItem;

    beforeEach(function(done) {
      request(app)
        .put('/api/todo/' + newTodo._id + '/' + newTodoItem._id)
        .set('authorization', 'Bearer ' + token)
        .send({
          name: 'Updated Todo',
          completed: true
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTodoItem = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTodoItem = {};
    });

    it('should respond with the updated todo list item', function() {
      updatedTodoItem.name.should.equal('Updated Todo');
      updatedTodoItem.completed.should.equal(true);
    });

  });
    
  //Delete todo list item
  describe('DELETE /api/todo/:id/:item_id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/todo/' + newTodo._id + '/' + newTodoItem._id)
        .set('authorization', 'Bearer ' + token)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when todo list item does not exist', function(done) {
      request(app)
        .delete('/api/todo/' + newTodo._id + '/' + newTodoItem._id)
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

  //Delete todo list
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
