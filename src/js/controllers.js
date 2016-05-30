
import angular from 'angular'

angular.module('app.controllers', [])

.controller('AppCtrl', ['$scope', '$mdDialog', ($scope, $mdDialog) => {
  $scope.start = (ev) => {
    $mdDialog.show({
      templateUrl: 'login',
      escapeToClose: false
    })
  }

  $scope.start()
}])
