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

export function index(req, res) {
  User.findByIdAsync(req.user._id, 'todo')
    .then(usr => {
      res.json(usr.todo);
  })
  .catch(handleError(res));
}

export function show(req, res) {
  User.findByIdAsync(req.user._id, 'todo')
    .then(usr => {
      res.json(usr.todo.id(req.params.id));
  })
  .catch(handleError(res));
}

export function create(req, res) {
  User.findByIdAsync(req.user._id, 'todo')
    .then( usr => {
      var new_todo = usr.todo.create({ name: req.body.name, items: [] });
      usr.todo.push(new_todo);
      usr.saveAsync()
        .then( 
          db_resp => { 
            res.status(201).json(db_resp[0].todo.id(new_todo.id));
          })
        .catch(handleError(res));
  })
  .catch(handleError(res));
}
 
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
    
  User.findByIdAsync(req.user._id, 'todo')
    .then(usr => {
      _.merge(usr.todo.id(req.params.id), req.body);
      usr.saveAsync()
          .then(db_resp => { 
              res.json(db_resp[0].todo.id(req.params.id));
            })
          .catch(handleError(res));
  })
  .catch(handleError(res));
}

export function destroy(req, res) {
  User.findByIdAsync(req.user._id, 'todo')
    .then( usr => {
      //Return 404 if the requested ID doesn't exist
      if ( !usr.todo.id(req.params.id) ) {
          res.status(404).end();
          return;
      }
      usr.todo.pull(req.params.id);
      usr.saveAsync()
        .then(respondWithResult(res,204))
        .catch(handleError(res));
  })
  .catch(handleError(res));
}

export function create_item(req,res) {
  User.findByIdAsync(req.user._id, 'todo')
    .then(usr => {
      //Merge in the updates to the targeted item then push them back to the db
      usr.todo.id(req.params.id).items.push(req.body);
      usr.saveAsync()
          .then(respondWithResult(res,201))
          .catch(handleError(res));
  })
  .catch(handleError(res));
}

export function update_item(req, res) {
  User.findByIdAsync(req.user._id, 'todo')
    .then(usr => {
      //Merge in the updates to the targeted item then push them back to the db
      _.merge(usr.todo.id(req.params.id).items.id(req.params.item_id), req.body);
      usr.saveAsync()
          .then(respondWithResult(res))
          .catch(handleError(res));
  })
  .catch(handleError(res));
}

export function destroy_item(req,res) {
  User.findByIdAsync(req.user._id, 'todo')
    .then( usr => {
      usr.todo.id(req.params.id).items.pull(req.params.item_id);
      usr.saveAsync()
        .then(respondWithResult(res))
        .catch(handleError(res));
  })
  .catch(handleError(res));
  
}