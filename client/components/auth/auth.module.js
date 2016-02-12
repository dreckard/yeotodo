'use strict';

angular.module('yeoTodoApp.auth', [
  'yeoTodoApp.constants',
  'yeoTodoApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
