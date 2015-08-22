var app = angular.module('WheelSwap.config', []);
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
