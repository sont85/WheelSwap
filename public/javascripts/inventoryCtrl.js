'use strict';

var app = angular.module('wheelSwap');
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
  };
  $scope.editingLink = function(car){
    marketplaceService.selectEditCarId = car._id;
  };
  $scope.editingCar = function(changedCarValue){
    marketplaceService.editingCar(changedCarValue);
  };
});

app.controller('PendingCtrl', function($scope, marketplaceService, $state) {
  marketplaceService.getPendingOffer()
  .success(function(pendingOffer){
    $scope.tradeOffers = pendingOffer;
    $scope.currentUserEmail = marketplaceService.currentUser.email;
  }).catch(function(error){
    console.log(error);
  });
  $scope.acceptOffer = function(offer) {
    console.log(offer);
    marketplaceService.acceptOffer(offer);
  };
  $scope.declineOffer = function(offer) {
    marketplaceService.declineOffer(offer);
  };
});
app.controller('HistoryCtrl', function($scope, marketplaceService, $state) {
  marketplaceService.getHistory()
  .success(function(response){
    console.log(response)
    $scope.history = response;
  }).catch(function(err){
    console.log(err);
  });
});
