'use strict';

var config = browser.params;
var webdriver = require('selenium-webdriver');
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model');

describe('Main View', function () {
    var page;
    var testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
    };

    /*var testUser = {
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password',
        todo: [{
                name: 'Fake Todo List 1',
                items: [
                    {
                        name: 'Fake Item (Complete)',
                        completed: true
                    },
                    {
                        name: 'Fake Item (Incomplete)',
                        completed: false
                    }
                ]
              },
            {
                name: 'Fake Todo List 2',
                items: [
                    {
                        name: 'Fake Item (Incomplete)',
                        completed: false
                    },
                    {
                        name: 'Fake Item (Complete)',
                        completed: true
                    }
                ]
              }]
    };*/

    beforeAll(function (done) {
        UserModel.removeAsync()
            .then(function () {
                UserModel.createAsync(testUser)
                    .then(() => {
                        browser.get(config.baseUrl + '/login');
                        var loginPage = require('../account/login/login.po');
                        loginPage.login(testUser);
                        page = require('./main.po');
                        done();
                    });
            });
    });

    /*it('should include jumbotron with correct data', function() {
      expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
      expect(page.imgEl.getAttribute('src')).toMatch(/yeoman.png$/);
      expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
    });*/

    it('should contain only the new todo button to start', function () {
        expect(browser.getCurrentUrl()).toBe(config.baseUrl + '/');
        expect(page.tabs).toBe.undefined;
        expect(page.newTabBtn).toBe.ok;
    });

    it('should be able to add a new todo list', function () {
        page.addTodo().then(() => {
            page = require('./main.po');
            expect(page.tabs).toBe.ok;
            expect(page.tabs.count()).toBe(1);
        });
    });

    it('should be able to rename the todo list', function () {
        page.tabInput.first().clear().then(() => {
            page.tabInput.first().sendKeys('Renamed todo', webdriver.Key.ENTER).then(() => {
                //browser.pause(5000);
                page = require('./main.po');
                expect(page.tabInput.first().getAttribute('value')).toBe('Renamed todo');
            });
        });
    });

    it('should be able to add items to the todo list', function () {
        page.newItemInput.first().sendKeys('Test Item 1', webdriver.Key.ENTER).then(() => {
            page = require('./main.po');
            expect(page.todoItems.count()).toBe(1);
            expect(page.todoItems.first().getText()).toBe('Test Item 1');
        });
    });

    it('should be able to mark todo list items as completed', function () {
        page.todoItems.first().click().then(() => {
            page = require('./main.po');
            expect(page.todoItems.first().evaluate('item.completed')).toBe(true);
        });
    });

    it('should be able to delete all completed todo list items', function () {
        page.newItemInput.first().sendKeys('Test Item 2', webdriver.Key.ENTER).then(() => {
            page = require('./main.po');
        }).then(() => {
            page.newItemInput.first().sendKeys('Test Item 3', webdriver.Key.ENTER).then(() => {
                page = require('./main.po');
                page.todoItems.last().click().then(() => {
                    page.clearCompletedBtns.first().click().then(() => {
                        expect(page.todoItems.count()).toBe(1);
                        expect(page.todoItems.first().getText()).toBe('Test Item 2');
                    });
                });
            })
        });
    });

    it('should be able to delete individual items from the todo list', function () {
        page.todoRemoveBtns.first().click().then(() => {
            page = require('./main.po');
            expect(page.todoItems.count()).toBe(0);
        });
    });

    it('should be able to delete a todo list', function () {
        page.addTodo().then(() => {
            page = require('./main.po');
            expect(page.tabs.count()).toBe(2);
            var closeBtn = page.tabCloseBtns.last().click().then(() => {
                expect(page.tabs.count()).toBe(1);
            });
        });
    });

});