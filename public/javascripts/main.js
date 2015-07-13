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
    .state('marketplace', {
      url: '/marketplace',
      templateUrl: 'views/marketplace.ejs',
      controller: 'MarketplaceCtrl'
    })
    .state('myinventory', {
      url: '/myinventory',
      templateUrl: 'views/myinventory.ejs',
      controller: 'InventoryCtrl'
    })
    .state('addcar', {
      url: '/addcar',
      templateUrl: 'views/addcar.ejs',
      controller: 'MarketplaceCtrl'
    })
    .state('trade', {
      url: '/trade',
      templateUrl: 'views/trade.ejs',
      controller: 'MarketplaceCtrl'
    })
    .state('editcar', {
      url: '/editcar',
      templateUrl: 'views/editcar.ejs',
      controller: 'InventoryCtrl'
    });
}]);

app.service('marketplaceService', function($http, constant) {
  var thisService = this;
  this.currentUser = null;
  this.selectEditCarId = null;
  this.selectedTradeCar = null;
  this.addCar = function(addCar) {
    $http.post(constant.url + 'add_car', addCar)
      .success(function(data) {
        thisService.getCurrentUser();
        console.log('successdata', data);
      }).catch(function(error) {
        console.log(error);
      });
  };

  this.editCar = function(editCar) {
    $http.post(constant.url + 'edit_car', editCar)
      .success(function(data) {
        thisService.getCurrentUser();
        console.log('successdata', data);
      }).catch(function(error) {
        console.log(error);
      });
  };

  this.getCurrentUser = function() {
    return $http.get(constant.url + 'get_current_user');
  };

  this.getMarketInventory = function() {
    return $http.get(constant.url + 'markeplace_inventory');
  };

  this.updateInventory = function() {
    return $http.get(constant.url + 'get_current_user');
  };

  this.deleteCar = function(car) {
    $http.delete(constant.url + 'delete_car/'+ thisService.currentUser.email + '/' + car._id)
      .success(function(data){
        console.log(data);
      }).catch(function(error){
        console.log(error);
      });
  };
  this.editingCar = function(changedCarValue) {
    $http.patch(constant.url + 'edit_car/' + thisService.currentUser.email + '/' + thisService.selectEditCarId, changedCarValue)
      .success(function(data){
        console.log(data);
      }).catch(function(error){
        console.log(error);
      });
  };
  this.tradeCar = function(selectedCar, myCar) {
    var trade = {};
    trade.selectedCar = selectedCar;
    trade.myCar = myCar;
    $http.patch(constant.url + "trade_car/", trade)
    .success(function(data) {
      console.log(data);
    }).catch(function(error){
      console.log(error);
    });
  };

});

app.controller('MarketplaceCtrl', function($scope, marketplaceService) {
  console.log('marketplace');
  marketplaceService.getCurrentUser()
  .success(function(currentUser){
    marketplaceService.currentUser = currentUser;
    $scope.myCars = currentUser.inventory;
  }).catch(function(error){
    console.log(error);
  });

  marketplaceService.getMarketInventory()
  .success(function (marketplaceInventory) {
    console.log(marketplaceInventory);
    var carInventory = [];
    marketplaceInventory.forEach(function(users){
      var userName = users.userName;
      users.inventory.forEach(function(item){
        item.userName = userName;
        carInventory.push(item);
      });
    });
    console.log(carInventory);
    $scope.carInventory = carInventory;
  }).catch(function(error) {
    console.log(error);
  });

  $scope.selectedCar = marketplaceService.selectedTradeCar;

  $scope.addingCar = function(addCar) {
    console.log('yes');
    console.log(addCar);
    $scope.addCar = '';
    marketplaceService.addCar(addCar);
  };
  $scope.selectedTradeCar = function(selectedTradeCar) {
    marketplaceService.selectedTradeCar = selectedTradeCar;
  };

  $scope.myCarToTrade = function(selectedCar, myCar) {
    marketplaceService.tradeCar(selectedCar, myCar)
    console.log(selectedCar, myCar);
  };
});


app.controller('InventoryCtrl', function($scope, marketplaceService, $state){
  marketplaceService.updateInventory()
    .success(function(currentUser){
      marketplaceService.currentUser = currentUser;
      $scope.myCars = currentUser.inventory;
    }).catch(function(error){
      console.log(error);
    });

  $scope.deleteCar = function(car) {
    marketplaceService.deleteCar(car);
    $state.reload();
  };

  $scope.editingLink = function(car){
    marketplaceService.selectEditCarId = car._id;
  };
  $scope.editingCar = function(changedCarValue){
    marketplaceService.editingCar(changedCarValue);
  };

});
