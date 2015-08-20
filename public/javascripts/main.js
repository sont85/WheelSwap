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
      controller: 'MainCtrl'
    })
    .state('trade', {
      url: '/trade',
      templateUrl: 'views/trade.html',
      controller: 'MainCtrl'
    })
    .state('myinventory', {
      url: '/myinventory',
      templateUrl: 'views/myinventory.html',
      controller: 'MainCtrl'
    })
    .state('editcar', {
      url: '/editcar',
      templateUrl: 'views/editcar.html',
      controller: 'MainCtrl'
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

app.controller('MainCtrl', function($scope, MarketplaceService){
  $scope.addCar = function() {
    MarketplaceService.addCar($scope.car);
  };
});

app.service('MarketplaceService', function($http){
  this.addCar = function(car) {
    $http.post('/marketplace/car', car)
    .success(function(response){
      console.log(response);
    }).catch(function(err){
      console.log(err);
    });
  };
});
