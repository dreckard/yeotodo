'use strict';

angular.module('adsProgrammingAssignmentApp.auth', [
  'adsProgrammingAssignmentApp.constants',
  'adsProgrammingAssignmentApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
