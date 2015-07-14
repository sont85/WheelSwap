'use strict';

var app = angular.module('wheelSwap');
app.controller('MarketplaceCtrl', function($scope, marketplaceService) {
  marketplaceService.getCurrentUser()
  .success(function(currentUser){
    marketplaceService.currentUser = currentUser;
    $scope.currentUser = currentUser.userName;
    $scope.myCars = currentUser.inventory;
  }).catch(function(error){
    console.log(error);
  });

  marketplaceService.getMarketInventory()
  .success(function (marketplaceInventory) {
    var carInventory = [];
    marketplaceInventory.forEach(function(users){
      var userName = users.userName;
      var email = users.email;
      users.inventory.forEach(function(item){
        item.userName = userName;
        item.email = email;
        carInventory.push(item);
      });
    });
    $scope.carInventory = carInventory;
  }).catch(function(error) {
    console.log(error);
  });

  $scope.selectedCar = marketplaceService.selectedTradeCar;
  $scope.addingCar = function(addCar) {
    $scope.addCar = '';
    marketplaceService.addCar(addCar);
  };
  $scope.selectedTradeCar = function(selectedTradeCar) {
    marketplaceService.selectedTradeCar = selectedTradeCar;
  };
  $scope.hideTradeButton = function(car) {
    return marketplaceService.currentUser.email === car.email;
  };
  $scope.myCarToTrade = function(selectedCar, myCar) {
    marketplaceService.myCarToTrade(selectedCar, myCar);
  };
});
