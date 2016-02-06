'use strict';

(function() {

class MainController {

  constructor($http,$scope) {
    this.$http = $http;
    this.awesomeThings = [];
    this.todo = [];
    this.newTodoItem = "";
    
    $http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
    });
    
    this.refreshTodo();
  }
    
  refreshTodo(selected_id) {
      this.$http.get('/api/todo').then(response => {
          //Iterate the response and restore the user to the same tab if applicable
          if ( response.data.length > 0 ) {
              if ( selected_id ) {
                  for (var i=0;i<response.data.length;i++) {
                      if ( response.data[i]._id == selected_id ) {
                          response.data[i].active = true;
                          break;
                      }
                  }
              }
              else {
                  //response.data[0].active = true;
                  response.data[response.data.length-1].active = true; //Select the last tab
              }
          }
          
          this.todo = response.data;
        });
      this.newTodoItem = "";
  }
  createTodo(name) {
      this.$http.post('/api/todo', { name: name })
        .then( todo => { 
          this.refreshTodo(todo._id);
      });
  }
  updateTodo(todo) {
      //Update name only
      this.$http.put('/api/todo/' + todo._id, { name: todo.name })
        .then( todo => { this.refreshTodo(todo._id) });
  }
  deleteTodo(todo) {
      this.todo[0].active = true;
      this.$http.delete('/api/todo/' + todo._id)
        .then( () => { this.refreshTodo() });
  }

  pushTodoItem(todo) {
      if ( this.newTodoItem.length > 0 ) {
        this.$http.post('/api/todo/' + todo._id, { name: this.newTodoItem, completed: false } )
          .then( () => { 
            this.refreshTodo(todo._id);
        });
      }
  }
  deleteTodoItem(todo,item) {
      this.$http.delete('/api/todo/' + todo._id + '/' + item._id)
        .then( () => { this.refreshTodo(todo._id) });
  }

  toggleTodoItem(todo,item) {
      this.$http.put('/api/todo/' + todo._id + '/' + item._id, { completed: item.completed } );
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
}

angular.module('adsProgrammingAssignmentApp')
  .controller('MainController', MainController);

})();
