/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/todo              ->  index
 * POST    /api/todo              ->  create
 * GET     /api/todo/:id          ->  show
 * PUT     /api/todo/:id          ->  update
 * DELETE  /api/todo/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Todo from './todo.model';
import User from '../user/user.model'

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Todos
export function index(req, res) {
  var userId = req.user._id;
    
  User.findOneAsync({ _id: userId }, 'todo')
    .then(usr => {
      res.json(usr.todo);
  })
  .catch(handleError(res));
  /*Todo.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));*/
}

// Gets a single Todo from the DB
export function show(req, res) {
  /*User.findByIdAsync(req.user._id)
    .then( usr => { 
      //debugger;
      res.json(usr.todo.id(req.params.id));
  })
  .catch(handleError(res));*/
    /*Todo.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));*/
}

// Creates a new Todo in the DB
export function create(req, res) {
  var userId = req.user._id;
  User.findOneAsync({ _id: userId }, 'todo')
    .then( usr => {
      usr.todo.push({ name: req.body.name, items: [] });
      usr.saveAsync()
        .then(respondWithResult(res,201))
        .catch(handleError(res));
  })
  .catch(handleError(res));
    /*Todo.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));*/
}
    
export function create_item(req,res) {
  var userId = req.user._id;
    
  User.findOneAsync({ _id: userId }, 'todo')
    .then(usr => {
      //Merge in the updates to the targeted item then push them back to the db
      usr.todo.id(req.params.id).items.push(req.body);
      usr.saveAsync()
          .then(respondWithResult(res,201))
          .catch(handleError(res));
  })
  .catch(handleError(res));
}

// Updates an existing Todo in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
    
  var userId = req.user._id;
  User.findOneAsync({ _id: userId }, 'todo')
    .then(usr => {
      _.merge(usr.todo.id(req.params.id), req.body);
      usr.saveAsync()
          .then(respondWithResult(res))
          .catch(handleError(res));
  })
  .catch(handleError(res));
    
  /*Todo.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));*/
}

export function update_item(req, res) {
  var userId = req.user._id;
    
  User.findOneAsync({ _id: userId }, 'todo')
    .then(usr => {
      //Merge in the updates to the targeted item then push them back to the db
      _.merge(usr.todo.id(req.params.id).items.id(req.params.item_id), req.body);
      usr.saveAsync()
          .then(respondWithResult(res))
          .catch(handleError(res));
  })
  .catch(handleError(res));
}

// Deletes a Todo from the DB
export function destroy(req, res) {
  var userId = req.user._id;
  User.findOneAsync({ _id: userId }, 'todo')
    .then( usr => {
      usr.todo.pull(req.params.id);
      usr.saveAsync()
        .then(respondWithResult(res))
        .catch(handleError(res));
  })
  .catch(handleError(res));
    /*Todo.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));*/
}

export function destroy_item(req,res) {
  var userId = req.user._id;
  User.findOneAsync({ _id: userId }, 'todo')
    .then( usr => {
      usr.todo.id(req.params.id).items.pull(req.params.item_id);
      usr.saveAsync()
        .then(respondWithResult(res))
        .catch(handleError(res));
  })
  .catch(handleError(res));
  
}