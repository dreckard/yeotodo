'use strict';

var express = require('express');
var controller = require('./todo.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

router.post('/:id', auth.isAuthenticated(), controller.create_item);
router.put('/:id/:item_id', auth.isAuthenticated(), controller.update_item);
router.patch('/:id/:item_id', auth.isAuthenticated(), controller.update_item);
router.delete('/:id/:item_id', auth.isAuthenticated(), controller.destroy_item);

module.exports = router;
