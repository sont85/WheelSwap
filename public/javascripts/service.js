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
    .success(function(){
      $state.go('pending');
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
