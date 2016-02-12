'use strict';

angular.module('yeoTodoApp', [
  'yeoTodoApp.auth',
  'yeoTodoApp.admin',
  'yeoTodoApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'focus-if',
  'puElasticInput'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
