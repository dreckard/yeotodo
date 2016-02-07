'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var todoCtrlStub = {
  index: 'todoCtrl.index',
  show: 'todoCtrl.show',
  create: 'todoCtrl.create',
  update: 'todoCtrl.update',
  destroy: 'todoCtrl.destroy'
};

var authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return 'authService.hasRole.' + role;
  }
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var todoIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './todo.controller': todoCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Todo API Router:', function() {

  it('should return an express router instance', function() {
    todoIndex.should.equal(routerStub);
  });

  describe('GET /api/todo', function() {

    it('should route to todo.controller.index', function() {
      routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'todoCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/todo/:id', function() {

    it('should route to todo.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'todoCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/todo', function() {

    it('should route to todo.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'todoCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/todo/:id', function() {

    it('should route to todo.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'todoCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/todo/:id', function() {

    it('should route to todo.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'todoCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/todo/:id', function() {

    it('should route to todo.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'authService.isAuthenticated', 'todoCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
