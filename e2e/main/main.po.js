/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function () {
    /*this.heroEl = element(by.css('.hero-unit'));
    this.h1El = this.heroEl.element(by.css('h1'));
    this.imgEl = this.heroEl.element(by.css('img'));*/
    this.newTabBtn = element(by.css('.tab-new-todo'));
    this.tabs = element.all(by.css('.tab-header'));
    this.tabInput = element.all(by.model('todo.name'));
    this.tabCloseBtns = element.all(by.css('i.tab-header-closebtn'));
    this.newItemInput = element.all(by.css('.new-item-input'));
    this.todoItems = element.all(by.css('.todo-item-label'));
    this.todoRemoveBtns = element.all(by.css('span.close'));
    this.clearCompletedBtns = element.all(by.css('.clear-completed'));

    this.addTodo = function () {
        return this.newTabBtn.click();
    };
};

module.exports = new MainPage();