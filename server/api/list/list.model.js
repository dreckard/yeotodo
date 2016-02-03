'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import {Schema} from 'mongoose';

var ListSchema = new mongoose.Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Person' },
  name: String
});

export default mongoose.model('List', ListSchema);
