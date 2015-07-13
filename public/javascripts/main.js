'use strict';

var app = angular.module('wheelSwap', ['ui.router']);
app.constant('constant', {
  url: 'http://localhost:3000/'
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
    .state('myinventory', {
      url: '/myinventory',
      templateUrl: 'views/myinventory.ejs',
      controller: 'InventoryCtrl'
    })
    .state('addcar', {
      url: '/addcar',
      templateUrl: 'views/addcar.ejs'
    })
    .state('trade', {
      url: '/trade',
      templateUrl: 'views/trade.ejs'
    })
    .state('editcar', {
      url: '/editcar',
      templateUrl: 'views/editcar.ejs',
      controller: 'InventoryCtrl'
    });
}]);

app.service('marketplaceService', function($http, constant) {
  var thisService = this;
  this.currentUser = null;
  this.addCar = function(addCar) {
    $http.post(constant.url + 'addcar', addCar)
      .success(function(data) {
        thisService.getCurrentUser();
        console.log('successdata', data);
      }).catch(function(error) {
        console.log(error);
      });
  };

  this.editCar = function(editCar) {
    $http.post('http://localhost:3000/editcar', edit)
      .success(function(data) {
        thisService.getCurrentUser();
        console.log('successdata', data);
      }).catch(function(error) {
        console.log(error);
      });
  };

  this.getCurrentUser = function() {
    $http.get(constant.url + 'getCurrentUser')
      .success(function(data){
        console.log(data);
        thisService.currentUser = data;
      }).catch(function(error){
        console.log(error);
      });
  };
  this.updateInventory = function() {
    return $http.get(constant.url + 'getCurrentUser')
  };
  this.deleteCar = function(car) {
    $http.delete(constant.url + "deleteCar/"+ thisService.currentUser.email + "/" + car._id)
      .success(function(data){
        console.log(data);
      }).catch(function(error){
        console.log(error);
      });
  };
  // this.editCar = function(car){
  //   $http.patch(constant.url + "editCar/"+car._id, car)
  //     .success(function(data){
  //       console.log(data);
  //     }).catch(function(error){
  //       console.log(error);
  //     });
  // }


});

app.controller('MarketplaceCtrl', function($scope, marketplaceService) {
  console.log("marketplace");
  marketplaceService.getCurrentUser();

  $scope.addingCar = function(addCar) {
    console.log(addCar);
    marketplaceService.addCar(addCar);
  };
});

app.controller('InventoryCtrl', function($scope, marketplaceService){
  marketplaceService.updateInventory()
    .success(function(data){
      console.log(data.inventory);
      marketplaceService.currentUser = data;
      $scope.myCars = data.inventory;
    }).catch(function(error){
      console.log(error);
    });

  $scope.deleteCar = function(car) {
    marketplaceService.deleteCar(car);
  };

  // $scope.editCar = function(car){
  //   marketplaceService.editCar(car);
  //
  // }

});
