'use strict';

(function () {

    class MainController {

        constructor($http, $q, $scope) {
            this.$http = $http;
            this.$q = $q;
            this.todo = []; // Client's todo data
            this.todo_sv = []; // Server's todo data
            this.newTodoItem = "";

            this.refreshTodo();
        }

        handleNetworkError(action) {
            return (function (err) {
                if (!action)
                    action = 'saving data';
                alert('Error ' + action + '\n' + err.status + ' ' + err.statusText);
            });
        }

        getActiveTodoId() {
            if (this.todo) {
                var active = _.find(this.todo, obj => {
                    return obj.active;
                });
                if (active)
                    return active._id;
            }
            return "";
        }

        getTodoByIdSv(id) {
            if (this.todo_sv) {
                return _.find(this.todo_sv, obj => {
                    return obj._id == id;
                });
            }
            return null;
        }

        refreshTodo(selected_id) {
            this.newTodoItem = "";
            return this.$http.get('/api/todo').then(response => {
                    //Navigate to a particular tab if supplied, otherwise default to the first
                    if (response.data.length > 0) {
                        if (selected_id) {
                            var selected_todo = _.find(response.data, obj => {
                                return obj._id == selected_id;
                            });
                            if (selected_todo)
                                selected_todo.active = true;
                            else
                                response.data[0].active = true;
                        } else {
                            response.data[0].active = true;
                        }
                    }

                    //Make a deep copy for reference so we don't trigger redundant updates
                    this.todo_sv = angular.copy(response.data);
                    this.todo = response.data;
                })
                .catch(this.handleNetworkError('refreshing data'));
        }

        createTodo(name) {
            return this.$http.post('/api/todo', {
                    name: name
                })
                .then(resp => {
                    return this.refreshTodo(resp.data._id);
                })
                .catch(this.handleNetworkError());
        }

        updateTodo(todo) {
            //This gets called from ng-blur and ng-keydown for the enter key regardless of whether the underlying data has changed
            //First verify that the name has indeed changed then send the update
            var todo_sv = this.getTodoByIdSv(todo._id);
            if (!todo_sv || todo_sv.name !== todo.name) {
                return this.$http.put('/api/todo/' + todo._id, {
                        name: todo.name
                    })
                    .then(resp => {
                        return this.refreshTodo(todo._id);
                    })
                    .catch(this.handleNetworkError());
            }
            return this.$q.resolve();
        }

        deleteTodo(todo) {
            //If deleting a list other than the currently selected one then the active page needs to be maintained
            var activeTodoId = this.getActiveTodoId();
            return this.$http.delete('/api/todo/' + todo._id)
                .then(() => {
                    return this.refreshTodo(activeTodoId)
                })
                .catch(this.handleNetworkError());
        }

        pushTodoItem(todo) {
            if (this.newTodoItem.length > 0) {
                return this.$http.post('/api/todo/' + todo._id, {
                        name: this.newTodoItem,
                        completed: false
                    })
                    .then(() => {
                        return this.refreshTodo(todo._id);
                    })
                    .catch(this.handleNetworkError());
            }
            return this.$q.resolve();
        }

        deleteTodoItem(todo, item, deferRefresh) {
            return this.$http.delete('/api/todo/' + todo._id + '/' + item._id)
                .then(() => {
                    if (!deferRefresh)
                        return this.refreshTodo(todo._id)
                })
                .catch(this.handleNetworkError());
        }

        toggleTodoItem(todo, item) {
            return this.$http.put('/api/todo/' + todo._id + '/' + item._id, {
                    completed: item.completed
                })
                .catch(this.handleNetworkError());
        }
        clearCompletedTodoItems(todo) {
            var promises = [];

            //Run all the DELETEs and combine the promises and 
            _.where(todo.items, {
                completed: true
            }).forEach(item => {
                promises.push(this.deleteTodoItem(todo, item, true));
            });

            this.$q.all(promises).then(() => {
                return this.refreshTodo(todo._id);
            });
        }

    }

    angular.module('yeoTodoApp')
        .controller('MainController', MainController);

})();