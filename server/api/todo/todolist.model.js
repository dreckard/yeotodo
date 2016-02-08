'use strict';

import TodoItem from './todoitem.model';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var TodoListSchema = new mongoose.Schema({
    name: String,
    items: [TodoItem.schema]
});

export default mongoose.model('TodoList', TodoListSchema);