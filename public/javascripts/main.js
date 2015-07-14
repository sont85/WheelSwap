'use strict';

var app = angular.module('wheelSwap', ['ui.router']);
app.constant('constant', {
  // url: 'http://localhost:3000/'
  url: 'https://wheelswap.herokuapp.com/'
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
    })
    .state('history', {
      url: '/history',
      templateUrl: 'views/history.ejs',
      controller: 'HistoryCtrl'
    });
}]);
