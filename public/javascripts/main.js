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
      templateUrl: 'views/login.ejs'
    })
    .state('marketplace', {
      url: '/marketplace',
      templateUrl: 'views/marketplace.ejs',
      controller: 'MarketplaceCtrl'
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
    .state('myinventory', {
      url: '/myinventory',
      templateUrl: 'views/myinventory.ejs',
      controller: 'InventoryCtrl'
    })
    .state('editcar', {
      url: '/editcar',
      templateUrl: 'views/editcar.ejs',
      controller: 'InventoryCtrl'
    })
    .state('pending', {
      url: '/pending',
      templateUrl: 'views/pending.ejs',
      controller: 'PendingCtrl'
    });
}]);

app.service('marketplaceService', function($http, constant, $state) {
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
        $state.reload();
      }).catch(function(error){
        console.log(error);
      });
  };
  this.editingCar = function(changedCarValue) {
    $http.patch(constant.url + 'edit_car/' + thisService.currentUser.email + '/' + thisService.selectEditCarId, changedCarValue)
      .success(function(data){
        $state.go('myinventory')
        console.log(data);
      }).catch(function(error){
        console.log(error);
      });
  };
  this.myCarToTrade = function(selectedCar, myCar) {
    console.log(selectedCar, myCar);
    var trade = {
                myOffer : { 'selectedCar' : selectedCar, 'myCar' : myCar, 'myEmail': this.currentUser.email },
                theirOffer : { 'selectedCar' : myCar, 'myCar' : selectedCar, 'theirEmail' : this.currentUser.email}
              };
    $http.patch(constant.url + 'trade_car', trade)
    .success(function(data){
      $state.go('pending')
      console.log(data);
    }).catch(function(error){
      console.log(error);
    });
  };
  this.getPendingOffer = function(){
    return $http.get(constant.url + 'get_pending_offer');
  };
  this.acceptOffer = function(acceptOffer) {
    $http.patch(constant.url + 'accept_offer', acceptOffer)
    .success(function(response) {
      console.log(response);
      $state.go('myinventory')
    }).catch(function(err){
      console.log(err);
    });
  };
  this.declineOffer = function(declineOffer) {
    $http.patch(constant.url + 'decline_offer', declineOffer)
    .success(function(response) {
      $state.reload()
    }).catch(function(err){
      console.log(err);
    });
  };
});

app.controller('MarketplaceCtrl', function($scope, marketplaceService) {
  marketplaceService.getCurrentUser()
  .success(function(currentUser){
    marketplaceService.currentUser = currentUser;
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
    console.log(pendingOffer)
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
    console.log(offer);
    marketplaceService.declineOffer(offer);
  };
});
