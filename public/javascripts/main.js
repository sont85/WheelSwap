'use strict';

var app = angular.module('wheelSwap', ['ui.router']);
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {url: '/', templateUrl: 'views/login.ejs'})
    .state('login', {url: '/login', templateUrl: 'views/login.ejs'})
    .state('marketplace', {url: '/marketplace', templateUrl: 'views/marketplace.ejs'})
    .state('myinventory', {url: '/myinventory', templateUrl: 'views/myinventory.ejs'})
    .state('addcar', {url: '/addcar', templateUrl: 'views/addcar.ejs'})
    .state('trade', {url: '/trade', templateUrl: 'views/trade.ejs'})
    .state('editcar', {url: '/editcar', templateUrl: 'views/editcar.ejs'});
}]);

app.controller("MainCtrl", function(){
});
