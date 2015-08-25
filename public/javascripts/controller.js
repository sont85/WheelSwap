(function() {
  'use strict';
  var app = angular.module('WheelSwap.Controller', []);

  app.controller('MarketplaceCtrl', function($scope, MarketplaceService, $location) {
    MarketplaceService.getAllCars($scope);
    $scope.selectCar = function(car) {
      $location.url('/trade/' + car._id);
    };
    $scope.showTradeButton = function(car) {
      if (!$scope.currentUserName) {
        return false;
      } else if (car.ownerName === $scope.currentUserName) {
        return false;
      } else {
        return true;
      }
    };
  });
  app.controller('TradeCtrl', function($scope, MarketplaceService, $location) {
    MarketplaceService.getTradeCarInfo($scope);
    $scope.myCarToTrade = function(myCar) {
      MarketplaceService.offerTrade($scope.selectedCar, myCar);
    };
  });
  app.controller('HistoryCtrl', function($scope, MarketplaceService, $location, $state) {
    MarketplaceService.history($scope);
    $scope.declineTrade = function(trade) {
      MarketplaceService.declineTrade(trade);
    };
    $scope.acceptTrade = function(trade) {
      MarketplaceService.acceptTrade(trade);
    };
  });
  app.controller('InventoryCtrl', function($scope, MarketplaceService, $location) {
    MarketplaceService.getInventory($scope);
    $scope.deleteCar = function(car) {
      MarketplaceService.deleteCar(car);
    };
    $scope.addCar = function() {
      MarketplaceService.addCar($scope.car);
    };
    $scope.editingLink = function(car) {
      $location.url('/inventory/car/' + car._id);
    };
    $scope.submitChanges = function() {
      MarketplaceService.editCar($scope.editCar);
    };
  });
})();
