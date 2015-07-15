'use strict';

var app = angular.module('wheelSwap');
app.service('marketplaceService', function($http, constant, $state) {
  var thisService = this;
  this.currentUser = null;
  this.selectEditCarId = null;
  this.selectedTradeCar = null;
  this.addCar = function(addCar) {
    $http.post(constant.url + 'add_car', addCar)
      .success(function(data) {
        thisService.getCurrentUser();
      }).catch(function(error) {
        console.log(error);
      });
  };

  this.editCar = function(editCar) {
    $http.post(constant.url + 'edit_car', editCar)
      .success(function(data) {
        thisService.getCurrentUser();
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
33
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
  this.getHistory = function() {
    return $http.get(constant.url + 'history');
  };
});
