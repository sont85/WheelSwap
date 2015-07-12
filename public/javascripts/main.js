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

app.service('marketplaceService', function($http) {
  this.addCar = function(addCar) {
    $http.post('http://localhost:3000/addcar', addCar)
    .success(function(data) {
      console.log('successdata', data);
    }).catch(function(error){
      console.log(error);
    });
  };
});

app.controller('MainCtrl', function($scope, marketplaceService){
$scope.addingCar = function(addCar) {
  console.log(addCar);
  marketplaceService.addCar(addCar);
};
});
