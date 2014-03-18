'use strict';


// Declare app level module which depends on filters, and services
angular.module('typeApp', [
  'ngRoute',
  'typeApp.filters',
  'typeApp.services',
  'typeApp.directives',
  'typeApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'views/main.html', controller: 'IndexController'});
  $routeProvider.when('/view2', {templateUrl: 'views/main.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
