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
      controller: 'MarketplaceCtrl'
    })
    .state('addcar', {
      url: '/addcar',
      templateUrl: 'views/addcar.html',
      controller: 'InventoryCtrl'
    })
    .state('trade', {
      url: '/trade/:carId',
      templateUrl: 'views/trade.html',
      controller: 'TradeCtrl'
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
      controller: 'HistoryCtrl'
    })
    .state('history', {
      url: '/history',
      templateUrl: 'views/history.html',
      controller: 'HistoryCtrl'
    });
}]);

app.service('MarketplaceService', function($http, $stateParams, $state){
  this.getAllCars = function() {
    return $http.get('marketplace');
  };
  this.addCar = function(car) {
    $http.post('/user/car/add', car)
    .success(function(response){
      $state.go('inventory');
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
  this.getTradeCarInfo = function() {
    return $http.get('/marketplace/trade/'+ $stateParams.carId);
  };
  var combineInfo = function(selectedCar, myCar) {
    return {
      myCar: myCar,
      selectedCar: selectedCar
    };
  };
  this.offerTrade = function(selectedCar, myCar) {
    var tradeInfo = combineInfo(selectedCar, myCar);
    $http.post('/marketplace/trade/create', tradeInfo)
    .success(function(response){
      console.log(response);
    }).catch(function(err){
      console.log(err);
    });
  };
  this.history = function() {
    return $http.get('/user/history');
  };
  this.declineTrade = function(trade) {
    $http.post('/marketplace/trade/decline', trade)
    .success(function(response){
      console.log(response);
      $state.reload();
    }).catch(function(err){
      console.log(err);
    });
  };
  this.acceptTrade = function(trade) {
    $http.patch('/marketplace/trade/accept', trade)
    .success(function(response){
      console.log(response);
      $state.go('history')
    }).catch(function(err){
      console.log(err);
    });
  }
});

app.controller('MarketplaceCtrl', function($scope, MarketplaceService, $location){
  MarketplaceService.getAllCars()
  .success(function(response){
    $scope.allCars = response.allCars;
    $scope.currentUserName = response.currentUserName;
  }).catch(function(err){
    console.log(err);
  });
  $scope.selectCar = function(car) {
    $location.url('/trade/'+car._id);
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
app.controller('TradeCtrl', function($scope, MarketplaceService, $location){
  MarketplaceService.getTradeCarInfo()
  .success(function(response){
    $scope.myInventory = response.myCars;
    $scope.selectedCar = response.carSolicited;
  }).catch(function(err){
    console.log(err);
  });
  $scope.myCarToTrade = function(myCar) {
    MarketplaceService.offerTrade($scope.selectedCar, myCar);
  };
});
app.controller('HistoryCtrl', function($scope, MarketplaceService, $location, $state){
  MarketplaceService.history()
  .success(function(response){
    $scope.solicits = response.history.filter(function(item){
      return item.status === 'pending';
    });
    $scope.unsolicits = response.history2.filter(function(item){
      return item.status === 'pending';
    });
    $scope.completedSolicits = response.history.filter(function(item){
      return item.status === 'complete';
    });
    $scope.completedUnsolicits = response.history2.filter(function(item){
      return item.status === 'complete';
    });
  }).catch(function(err){
    console.log(err);
  });
  $scope.declineTrade = function(trade){
    MarketplaceService.declineTrade(trade);
  };
  $scope.acceptTrade = function(trade) {
    MarketplaceService.acceptTrade(trade);
  };
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
  };
  $scope.editingLink = function(car) {
    $location.url('/inventory/car/'+car._id);
  };
  $scope.submitChanges = function() {
    MarketplaceService.editCar($scope.editCar);
    $state.go('inventory');
  };
});
