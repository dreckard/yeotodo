'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var TodoSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Todo', TodoSchema);
