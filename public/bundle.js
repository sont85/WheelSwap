'use strict';
var app = angular.module('WheelSwap', ['ui.router', 'WheelSwap.Controller', 'WheelSwap.config', 'WheelSwap.Service']);

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

'use strict';
var app = angular.module('WheelSwap.Controller', []);

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

'use strict';
var app = angular.module('WheelSwap.Service', []);
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
      $state.go('history');
    }).catch(function(err){
      console.log(err);
    });
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnV2hlZWxTd2FwJywgWyd1aS5yb3V0ZXInLCAnV2hlZWxTd2FwLkNvbnRyb2xsZXInLCAnV2hlZWxTd2FwLmNvbmZpZycsICdXaGVlbFN3YXAuU2VydmljZSddKTtcbiIsInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnV2hlZWxTd2FwLmNvbmZpZycsIFtdKTtcbmFwcC5jb25zdGFudCgnY29uc3RhbnQnLCB7XG4gIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC8nXG4gIC8vIHVybDogJ2h0dHBzOi8vd2hlZWxzd2FwLmhlcm9rdWFwcC5jb20vJ1xufSk7XG5cbmFwcC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2luZGV4Jywge1xuICAgICAgdXJsOiAnLycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2xvZ2luLmh0bWwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ21hcmtldHBsYWNlJywge1xuICAgICAgdXJsOiAnL21hcmtldHBsYWNlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvbWFya2V0cGxhY2UuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnTWFya2V0cGxhY2VDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdhZGRjYXInLCB7XG4gICAgICB1cmw6ICcvYWRkY2FyJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvYWRkY2FyLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0ludmVudG9yeUN0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3RyYWRlJywge1xuICAgICAgdXJsOiAnL3RyYWRlLzpjYXJJZCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RyYWRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1RyYWRlQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgnaW52ZW50b3J5Jywge1xuICAgICAgdXJsOiAnL2ludmVudG9yeScsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2ludmVudG9yeS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdJbnZlbnRvcnlDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdlZGl0Y2FyJywge1xuICAgICAgdXJsOiAnL2ludmVudG9yeS9jYXIvOmNhcklkJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZWRpdGNhci5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdJbnZlbnRvcnlDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdwZW5kaW5nJywge1xuICAgICAgdXJsOiAnL3BlbmRpbmcnLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9wZW5kaW5nLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0hpc3RvcnlDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdoaXN0b3J5Jywge1xuICAgICAgdXJsOiAnL2hpc3RvcnknLFxuICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9oaXN0b3J5Lmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0hpc3RvcnlDdHJsJ1xuICAgIH0pO1xufV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdXaGVlbFN3YXAuQ29udHJvbGxlcicsIFtdKTtcblxuYXBwLmNvbnRyb2xsZXIoJ01hcmtldHBsYWNlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgTWFya2V0cGxhY2VTZXJ2aWNlLCAkbG9jYXRpb24pe1xuICBNYXJrZXRwbGFjZVNlcnZpY2UuZ2V0QWxsQ2FycygpXG4gIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAkc2NvcGUuYWxsQ2FycyA9IHJlc3BvbnNlLmFsbENhcnM7XG4gICAgJHNjb3BlLmN1cnJlbnRVc2VyTmFtZSA9IHJlc3BvbnNlLmN1cnJlbnRVc2VyTmFtZTtcbiAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcbiAgJHNjb3BlLnNlbGVjdENhciA9IGZ1bmN0aW9uKGNhcikge1xuICAgICRsb2NhdGlvbi51cmwoJy90cmFkZS8nK2Nhci5faWQpO1xuICB9O1xuICAkc2NvcGUuc2hvd1RyYWRlQnV0dG9uID0gZnVuY3Rpb24oY2FyKSB7XG4gICAgaWYgKCEkc2NvcGUuY3VycmVudFVzZXJOYW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChjYXIub3duZXJOYW1lID09PSAkc2NvcGUuY3VycmVudFVzZXJOYW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcbn0pO1xuYXBwLmNvbnRyb2xsZXIoJ1RyYWRlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgTWFya2V0cGxhY2VTZXJ2aWNlLCAkbG9jYXRpb24pe1xuICBNYXJrZXRwbGFjZVNlcnZpY2UuZ2V0VHJhZGVDYXJJbmZvKClcbiAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICRzY29wZS5teUludmVudG9yeSA9IHJlc3BvbnNlLm15Q2FycztcbiAgICAkc2NvcGUuc2VsZWN0ZWRDYXIgPSByZXNwb25zZS5jYXJTb2xpY2l0ZWQ7XG4gIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG4gICRzY29wZS5teUNhclRvVHJhZGUgPSBmdW5jdGlvbihteUNhcikge1xuICAgIE1hcmtldHBsYWNlU2VydmljZS5vZmZlclRyYWRlKCRzY29wZS5zZWxlY3RlZENhciwgbXlDYXIpO1xuICB9O1xufSk7XG5hcHAuY29udHJvbGxlcignSGlzdG9yeUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIE1hcmtldHBsYWNlU2VydmljZSwgJGxvY2F0aW9uLCAkc3RhdGUpe1xuICBNYXJrZXRwbGFjZVNlcnZpY2UuaGlzdG9yeSgpXG4gIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAkc2NvcGUuc29saWNpdHMgPSByZXNwb25zZS5oaXN0b3J5LmZpbHRlcihmdW5jdGlvbihpdGVtKXtcbiAgICAgIHJldHVybiBpdGVtLnN0YXR1cyA9PT0gJ3BlbmRpbmcnO1xuICAgIH0pO1xuICAgICRzY29wZS51bnNvbGljaXRzID0gcmVzcG9uc2UuaGlzdG9yeTIuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgcmV0dXJuIGl0ZW0uc3RhdHVzID09PSAncGVuZGluZyc7XG4gICAgfSk7XG4gICAgJHNjb3BlLmNvbXBsZXRlZFNvbGljaXRzID0gcmVzcG9uc2UuaGlzdG9yeS5maWx0ZXIoZnVuY3Rpb24oaXRlbSl7XG4gICAgICByZXR1cm4gaXRlbS5zdGF0dXMgPT09ICdjb21wbGV0ZSc7XG4gICAgfSk7XG4gICAgJHNjb3BlLmNvbXBsZXRlZFVuc29saWNpdHMgPSByZXNwb25zZS5oaXN0b3J5Mi5maWx0ZXIoZnVuY3Rpb24oaXRlbSl7XG4gICAgICByZXR1cm4gaXRlbS5zdGF0dXMgPT09ICdjb21wbGV0ZSc7XG4gICAgfSk7XG4gIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG4gICRzY29wZS5kZWNsaW5lVHJhZGUgPSBmdW5jdGlvbih0cmFkZSl7XG4gICAgTWFya2V0cGxhY2VTZXJ2aWNlLmRlY2xpbmVUcmFkZSh0cmFkZSk7XG4gIH07XG4gICRzY29wZS5hY2NlcHRUcmFkZSA9IGZ1bmN0aW9uKHRyYWRlKSB7XG4gICAgTWFya2V0cGxhY2VTZXJ2aWNlLmFjY2VwdFRyYWRlKHRyYWRlKTtcbiAgfTtcbn0pO1xuYXBwLmNvbnRyb2xsZXIoJ0ludmVudG9yeUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIE1hcmtldHBsYWNlU2VydmljZSwgJHN0YXRlLCAkbG9jYXRpb24pe1xuICBNYXJrZXRwbGFjZVNlcnZpY2UuZ2V0SW52ZW50b3J5KClcbiAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICRzY29wZS5teUludmVudG9yeSA9IHJlc3BvbnNlLmludmVudG9yeTtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG4gICRzY29wZS5kZWxldGVDYXIgPSBmdW5jdGlvbihjYXIpIHtcbiAgICBNYXJrZXRwbGFjZVNlcnZpY2UuZGVsZXRlQ2FyKGNhcik7XG4gICAgJHN0YXRlLnJlbG9hZCgpO1xuICB9O1xuICAkc2NvcGUuYWRkQ2FyID0gZnVuY3Rpb24oKSB7XG4gICAgTWFya2V0cGxhY2VTZXJ2aWNlLmFkZENhcigkc2NvcGUuY2FyKTtcbiAgfTtcbiAgJHNjb3BlLmVkaXRpbmdMaW5rID0gZnVuY3Rpb24oY2FyKSB7XG4gICAgJGxvY2F0aW9uLnVybCgnL2ludmVudG9yeS9jYXIvJytjYXIuX2lkKTtcbiAgfTtcbiAgJHNjb3BlLnN1Ym1pdENoYW5nZXMgPSBmdW5jdGlvbigpIHtcbiAgICBNYXJrZXRwbGFjZVNlcnZpY2UuZWRpdENhcigkc2NvcGUuZWRpdENhcik7XG4gICAgJHN0YXRlLmdvKCdpbnZlbnRvcnknKTtcbiAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdXaGVlbFN3YXAuU2VydmljZScsIFtdKTtcbmFwcC5zZXJ2aWNlKCdNYXJrZXRwbGFjZVNlcnZpY2UnLCBmdW5jdGlvbigkaHR0cCwgJHN0YXRlUGFyYW1zLCAkc3RhdGUpe1xuICB0aGlzLmdldEFsbENhcnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCdtYXJrZXRwbGFjZScpO1xuICB9O1xuICB0aGlzLmFkZENhciA9IGZ1bmN0aW9uKGNhcikge1xuICAgICRodHRwLnBvc3QoJy91c2VyL2Nhci9hZGQnLCBjYXIpXG4gICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgJHN0YXRlLmdvKCdpbnZlbnRvcnknKTtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbiAgfTtcbiAgdGhpcy5nZXRJbnZlbnRvcnkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCcvdXNlci9pbnZlbnRvcnknKTtcbiAgfTtcbiAgdGhpcy5kZWxldGVDYXIgPSBmdW5jdGlvbihjYXIpIHtcbiAgICAkaHR0cC5kZWxldGUoJy91c2VyL2Nhci8nICsgY2FyLl9pZClcbiAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG4gIH07XG4gIHRoaXMuZWRpdENhciA9IGZ1bmN0aW9uKGNhcikge1xuICAgICRodHRwLnBvc3QoJy91c2VyL2Nhci8nICsgJHN0YXRlUGFyYW1zLmNhcklkLCBjYXIpXG4gICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xuICB9O1xuICB0aGlzLmdldFRyYWRlQ2FySW5mbyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAkaHR0cC5nZXQoJy9tYXJrZXRwbGFjZS90cmFkZS8nKyAkc3RhdGVQYXJhbXMuY2FySWQpO1xuICB9O1xuICB2YXIgY29tYmluZUluZm8gPSBmdW5jdGlvbihzZWxlY3RlZENhciwgbXlDYXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbXlDYXI6IG15Q2FyLFxuICAgICAgc2VsZWN0ZWRDYXI6IHNlbGVjdGVkQ2FyXG4gICAgfTtcbiAgfTtcbiAgdGhpcy5vZmZlclRyYWRlID0gZnVuY3Rpb24oc2VsZWN0ZWRDYXIsIG15Q2FyKSB7XG4gICAgdmFyIHRyYWRlSW5mbyA9IGNvbWJpbmVJbmZvKHNlbGVjdGVkQ2FyLCBteUNhcik7XG4gICAgJGh0dHAucG9zdCgnL21hcmtldHBsYWNlL3RyYWRlL2NyZWF0ZScsIHRyYWRlSW5mbylcbiAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG4gIH07XG4gIHRoaXMuaGlzdG9yeSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAkaHR0cC5nZXQoJy91c2VyL2hpc3RvcnknKTtcbiAgfTtcbiAgdGhpcy5kZWNsaW5lVHJhZGUgPSBmdW5jdGlvbih0cmFkZSkge1xuICAgICRodHRwLnBvc3QoJy9tYXJrZXRwbGFjZS90cmFkZS9kZWNsaW5lJywgdHJhZGUpXG4gICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xuICB9O1xuICB0aGlzLmFjY2VwdFRyYWRlID0gZnVuY3Rpb24odHJhZGUpIHtcbiAgICAkaHR0cC5wYXRjaCgnL21hcmtldHBsYWNlL3RyYWRlL2FjY2VwdCcsIHRyYWRlKVxuICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICRzdGF0ZS5nbygnaGlzdG9yeScpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xuICB9O1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=