'use strict';

var app = angular.module('wheelSwap', ['ui.router']);
app.constant('constant', {
  url: 'http://localhost:3000/'
  // url: 'https://wheelswap.herokuapp.com/'
});

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'views/login.html'
    })
    .state('marketplace', {
      url: '/marketplace',
      templateUrl: 'views/marketplace.html',
      controller: 'MainCtrl'
    })
    .state('addcar', {
      url: '/addcar',
      templateUrl: 'views/addcar.html',
      controller: 'InventoryCtrl'
    })
    .state('trade', {
      url: '/trade',
      templateUrl: 'views/trade.html',
      controller: 'MainCtrl'
    })
    .state('inventory', {
      url: '/inventory',
      templateUrl: 'views/inventory.html',
      controller: 'InventoryCtrl'
    })
    .state('editcar', {
      url: '/inventory/car/:carId',
      templateUrl: 'views/editcar.html',
      controller: 'InventoryCtrl'
    })
    .state('pending', {
      url: '/pending',
      templateUrl: 'views/pending.html',
      controller: 'MainCtrl'
    })
    .state('history', {
      url: '/history',
      templateUrl: 'views/history.html',
      controller: 'MainCtrl'
    });
}]);

app.service('MarketplaceService', function($http, $stateParams){
  this.getAllCars = function() {
    return $http.get('marketplace');
  };
  this.addCar = function(car) {
    $http.post('/user/car', car)
    .success(function(response){
      console.log(response);
    }).catch(function(err){
      console.log(err);
    });
  };
  this.getInventory = function() {
    return $http.get('/user/inventory');
  };
  this.deleteCar = function(car) {
    $http.delete('/user/car/' + car._id)
    .success(function(response){
      console.log(response);
    }).catch(function(err){
      console.log(err);
    });
  };
  this.editCar = function(car) {
    $http.post('/user/car/' + $stateParams.carId, car)
    .success(function(response){
      console.log(response);
    }).catch(function(err){
      console.log(err);
    });
  };
});

app.controller('MainCtrl', function($scope, MarketplaceService){
  MarketplaceService.getAllCars()
  .success(function(response){
    $scope.allCars = response;
    console.log(response);
  }).catch(function(err){
    console.log(err);
  });
});
app.controller('InventoryCtrl', function($scope, MarketplaceService, $state, $location){
  MarketplaceService.getInventory()
  .success(function(response){
    $scope.myInventory = response.inventory;
    console.log(response);
  }).catch(function(err){
    console.log(err);
  });
  $scope.deleteCar = function(car) {
    MarketplaceService.deleteCar(car);
    $state.reload();
  };
  $scope.addCar = function() {
    MarketplaceService.addCar($scope.car);
    $state.go('inventory');
  };
  $scope.editingLink = function(car) {
    $location.url('/inventory/car/'+car._id);
  };
  $scope.submitChanges = function() {
    MarketplaceService.editCar($scope.editCar);
    $state.go('inventory');
  };
});
