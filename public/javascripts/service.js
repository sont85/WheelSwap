(function() {
  'use strict';
  var app = angular.module('WheelSwap.Service', []);
  app.service('MarketplaceService', function($http, $stateParams, $state) {
    this.getAllCars = function() {
      return $http.get('marketplace');
    };
    this.addCar = function(car) {
      $http.post('/user/car/add', car)
        .success(function(response) {
          $state.go('inventory');
          swal('Successfully added Car', 'Car is now available at Marketplace.', 'success')
        }).catch(function(err) {
          console.log(err);
        });
    };
    this.getInventory = function() {
      return $http.get('/user/inventory');
    };
    this.deleteCar = function(car) {
      swal({
        title: 'Delete Car?',
        text: 'Remove car from Inventory and Marketplace',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, Delete Car',
        cancelButtonText: 'Cancel Delete!',
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm) {
        if (isConfirm) {
          swal('Car Deleted!', 'Car remove from Inventory.', 'success');
          $http.delete('/user/car/' + car._id)
            .success(function(response) {
              $state.reload();
            }).catch(function(err) {
              console.log(err);
            });
        } else {
          swal('Cancelled', 'Delete Cancel', 'error');
        }
      });
    };
    this.editCar = function(car) {
      $http.post('/user/car/' + $stateParams.carId, car)
        .success(function(response) {
          swal('Success', 'Car info updated.', 'success')
        }).catch(function(err) {
          console.log(err);
        });
    };
    this.getTradeCarInfo = function() {
      return $http.get('/marketplace/trade/' + $stateParams.carId);
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
        .success(function() {
          $state.go('pending');
        }).catch(function(err) {
          console.log(err);
        });
    };
    this.history = function() {
      return $http.get('/user/history');
    };
    this.declineTrade = function(trade) {
      $http.post('/marketplace/trade/decline', trade)
        .success(function(response) {
          swal('Successfully cancel trade offer.')
          $state.reload();
        }).catch(function(err) {
          console.log(err);
        });
    };
    this.acceptTrade = function(trade) {
      swal({
        title: 'Accept Trade?',
        text: 'Trade will be finalized once accepted',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, Accept Deal',
        cancelButtonText: 'Cancel!',
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm) {
        if (isConfirm) {
          swal('Congratulation!', 'Trade is complete.', 'success');
          $http.patch('/marketplace/trade/accept', trade)
            .success(function(response) {
              $state.go('history');
            }).catch(function(err) {
              console.log(err);
            });
        } else {
          swal('Cancelled', 'Trade aborted', 'error');
        }
      });
    };
  });
})();
