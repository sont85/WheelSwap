'use strict';

var app = angular.module('wheelSwap', ['ui.router']);
app.constant('constant', {
  url: 'http://localhost:3000/'
});


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

app.service('marketplaceService', function($http, constant) {
  var thisService = this;
  this.currentUser = null;
  this.addCar = function(addCar) {
    $http.post(constant.url + 'addcar', addCar)
      .success(function(data) {
        thisService.getCurrentUser();
        console.log('successdata', data);
      }).catch(function(error) {
        console.log(error);
      });
  };
  this.getCurrentUser = function() {
    $http.get(constant.url + 'getCurrentUser')
      .success(function(data){
        console.log(data);
        thisService.currentUser = data;
      }).catch(function(error){
        console.log(error);
      });
  };
  this.updateInventory = function() {
    return $http.get(constant.url + 'getCurrentUser')
  };
  this.deleteCar = function() {
    // $http.delete('')
  };

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
  marketplaceService.updateInventory()
    .success(function(data){
      console.log(data.inventory);
      marketplaceService.currentUser = data;
      $scope.myCars = data.inventory;
    }).catch(function(error){
      console.log(error);
    });

  $scope.deleteCar = function() {
    marketplaceService.deleteCar();
  };

});
