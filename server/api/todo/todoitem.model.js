'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var TodoItemSchema = new mongoose.Schema({
    name: String,
    completed: Boolean
});

export default mongoose.model('TodoItem', TodoItemSchema);