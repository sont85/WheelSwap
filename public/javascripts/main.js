'use strict';

var app = angular.module('wheelSwap', ['ui.router']);
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'views/login.ejs'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.ejs'
    })
    .state('marketplace', {
      url: '/marketplace',
      templateUrl: 'views/marketplace.ejs'
    })
    .state('myinventory', {
      url: '/myinventory',
      templateUrl: 'views/myinventory.ejs',
      controller: 'inventoryCtrl'
    })
    .state('addcar', {
      url: '/addcar',
      templateUrl: 'views/addcar.ejs'
    })
    .state('trade', {
      url: '/trade',
      templateUrl: 'views/trade.ejs'
    })
    .state('editcar', {
      url: '/editcar',
      templateUrl: 'views/editcar.ejs'
    });
}]);

app.service('marketplaceService', function($http) {
  var thisService = this
  this.currentUser = null;
  this.addCar = function(addCar) {
    $http.post('http://localhost:3000/addcar', addCar)
      .success(function(data) {
        console.log('successdata', data);
      }).catch(function(error) {
        console.log(error);
      });
  };
  this.getCurrentUser = function() {
    $http.get('http://localhost:3000/getCurrentUser')
      .success(function(data){
        console.log(data)
        thisService.currentUser = data;
      }).catch(function(error){
        console.log(error);
      });
  };
  // this.getInventory = function() {
  //   $http.get("http://localhost:3000/getInventory")
  //     .success(function(data) {
  //       console.log(data);
  //     }).catch(function(error){
  //       console.log(error);
  //     });
  // };

});

app.controller('MainCtrl', function($scope, marketplaceService) {
  console.log("marketplace");
  marketplaceService.getCurrentUser();

  $scope.addingCar = function(addCar) {
    console.log(addCar);
    marketplaceService.addCar(addCar);
  };
});

app.controller('inventoryCtrl', function($scope, marketplaceService){
  console.log(marketplaceService.currentUser);
  // marketplaceService.getInventory();

});
