(function() {
  'use strict';
  var app = angular.module('WheelSwap.Service', []);
  app.service('MarketplaceService', function($http, $stateParams, $state) {
    this.getAllCars = function($scope) {
      $http.get('marketplace')
      .success(function(response) {
        $scope.allCars = response.allCars;
        $scope.currentUserName = response.currentUserName;
      }).catch(function(err) {
        console.log(err);
      });
    };
    this.addCar = function(car) {
      $http.post('/user/car/add', car)
        .success(function(response) {
          if (response === 'fail') {
            swal('Fail to add Car', 'Make sure year format is 4 digit', 'error');
          } else {
            $state.go('inventory');
            swal('Successfully added Car', 'Car is now available at Marketplace.', 'success')
          }
        }).catch(function(err) {
          console.log(err);
        });
    };
    this.getInventory = function($scope) {
      $http.get('/user/inventory')
      .success(function(response) {
        $scope.myInventory = response.inventory;
      }).catch(function(err) {
        console.log(err);
        $state.go('login')
      });
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
          $state.reload();
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
          if (response === 'fail'){
            swal('Fail to edit Car', 'Make sure year format is 4 digit', 'error');
          } else {
            $state.go('inventory');
            swal('Success', 'Car info updated.', 'success');
          }
        }).catch(function(err) {
          console.log(err);
        });
    };
    this.getTradeCarInfo = function($scope) {
      $http.get('/marketplace/trade/' + $stateParams.carId)
      .success(function(response) {
        $scope.myInventory = response.myCars;
        $scope.selectedCar = response.carSolicited;
      }).catch(function(err) {
        console.log(err);
      });
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
    this.history = function($scope) {
      $http.get('/user/history')
      .success(function(response) {
        $scope.solicits = response.history.filter(function(item) {
          return item.status === 'pending';
        });
        $scope.unsolicits = response.history2.filter(function(item) {
          return item.status === 'pending';
        });
        $scope.completedSolicits = response.history.filter(function(item) {
          return item.status === 'complete';
        });
        $scope.completedUnsolicits = response.history2.filter(function(item) {
          return item.status === 'complete';
        });
        $scope.cancelSolicits = response.history.filter(function(item) {
          return item.status === 'cancel';
        });
        $scope.cancelUnsolicits = response.history2.filter(function(item) {
          return item.status === 'cancel';
        });
      }).catch(function(err) {
        console.log(err);
        $state.go('login');
      });
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
