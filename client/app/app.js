'use strict';

angular.module('adsProgrammingAssignmentApp', [
  'adsProgrammingAssignmentApp.auth',
  'adsProgrammingAssignmentApp.admin',
  'adsProgrammingAssignmentApp.constants',
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
