'use strict';

import * as TodoCtrl from './todo.controller.js';

describe('Todo Controller', function () {
    it('should fail when creating a todo list with missing or invalid data', function () {
        expect(() => {
            TodoCtrl.create({});
        }).to.throw;
    });
});