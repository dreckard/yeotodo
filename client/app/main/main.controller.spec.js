'use strict';

describe('Controller: MainController', function () {

    // load the controller's module
    beforeEach(module('adsProgrammingAssignmentApp'));
    beforeEach(module('stateMock'));

    var scope;
    var MainController;
    var state;
    var $httpBackend;
    var testTodo;

    var testTodo = [{
        _id: '1a',
        name: 'New Todo 1',
        items: [{
            _id: '2b',
            name: 'New Todo Item',
            completed: false
                }]
            }];

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, $state) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/todo').respond([]);

        scope = $rootScope.$new();
        state = $state;
        MainController = $controller('MainController', {
            $scope: scope
        });
        $httpBackend.flush();
    }));

    it('should attach a list of todos to the controller', function () {
        $httpBackend.expectGET('/api/todo').respond(testTodo);
        MainController.refreshTodo().then(() => {
            expect(MainController.todo.length).toBe(1);
        });
        $httpBackend.flush();
    });

    //Since the controller integrates a GET call after every request the only things to test for here are that the proper routes are being used and no exceptions are thrown
    it('should be able to create a new todo list', function () {
        $httpBackend.expectPOST('/api/todo').respond(testTodo);
        $httpBackend.expectGET('/api/todo').respond(testTodo);

        var origLen = MainController.todo.length;
        MainController.createTodo('New Todo 1');
        $httpBackend.flush();
    });

    it('should be able to create a new todo list item', function () {
        $httpBackend.expectPOST('/api/todo/' + testTodo[0]._id).respond(testTodo);
        $httpBackend.expectGET('/api/todo').respond(testTodo);

        MainController.newTodoItem = 'Test Todo Item';
        MainController.pushTodoItem(testTodo[0]);
        $httpBackend.flush();
    });

    it('should be able to update a todo list', function () {
        $httpBackend.expectPUT('/api/todo/' + testTodo[0]._id).respond(testTodo);
        $httpBackend.expectGET('/api/todo').respond(testTodo);

        var updatedTodo = angular.copy(testTodo[0]);
        updatedTodo.name = 'New Name';
        MainController.updateTodo(updatedTodo);
        $httpBackend.flush();
    });

    it('should be able to delete a todo list item', function () {
        $httpBackend.expectDELETE('/api/todo/' + testTodo[0]._id + '/' + testTodo[0].items[0]._id).respond(testTodo);
        $httpBackend.expectGET('/api/todo').respond(testTodo);

        MainController.deleteTodoItem(testTodo[0], testTodo[0].items[0]);
        $httpBackend.flush();
    });

    it('should be able to delete a todo list', function () {
        $httpBackend.expectDELETE('/api/todo/' + testTodo[0]._id).respond(testTodo);
        $httpBackend.expectGET('/api/todo').respond(testTodo);

        MainController.deleteTodo(testTodo[0]);
        $httpBackend.flush();
    });
});