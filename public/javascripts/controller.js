(function() {
  'use strict';
  var app = angular.module('WheelSwap.Controller', []);

  app.controller('MarketplaceCtrl', function($scope, MarketplaceService, $location) {
    MarketplaceService.getAllCars()
      .success(function(response) {
        $scope.allCars = response.allCars;
        $scope.currentUserName = response.currentUserName;
      }).catch(function(err) {
        console.log(err);
      });
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
    MarketplaceService.getTradeCarInfo()
      .success(function(response) {
        $scope.myInventory = response.myCars;
        $scope.selectedCar = response.carSolicited;
      }).catch(function(err) {
        console.log(err);
      });
    $scope.myCarToTrade = function(myCar) {
      MarketplaceService.offerTrade($scope.selectedCar, myCar);
    };
  });
  app.controller('HistoryCtrl', function($scope, MarketplaceService, $location, $state) {
    MarketplaceService.history()
      .success(function(response) {
        $scope.solicits = response.history.filter(function(item) {
          return item.status === 'pending';
        });
        $scope.unsolicits = response.history2.filter(function(item) {
          return item.status === 'pending';
        });
        $scope.completedSolicits = response.history.filter(function(item) {
          return item.status === 'complete';
        });
        $scope.completedUnsolicits = response.history2.filter(function(item) {
          return item.status === 'complete';
        });
        $scope.cancelSolicits = response.history.filter(function(item) {
          return item.status === 'cancel';
        });
        $scope.cancelUnsolicits = response.history2.filter(function(item) {
          return item.status === 'cancel';
        });
      }).catch(function(err) {
        console.log(err);
      });
    $scope.declineTrade = function(trade) {
      MarketplaceService.declineTrade(trade);
    };
    $scope.acceptTrade = function(trade) {
      MarketplaceService.acceptTrade(trade);
    };
  });
  app.controller('InventoryCtrl', function($scope, MarketplaceService, $state, $location) {
    MarketplaceService.getInventory()
      .success(function(response) {
        $scope.myInventory = response.inventory;
      }).catch(function(err) {
        console.log(err);
      });
    $scope.deleteCar = function(car) {
      MarketplaceService.deleteCar(car);
      $state.reload();
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
