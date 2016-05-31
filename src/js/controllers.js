
import angular from 'angular'

angular.module('app.controllers', [])

.controller('AppCtrl', ['$scope', '$mdDialog', ($scope, $mdDialog) => {
  $scope.start = (ev) => {
    $mdDialog.show({
      template: require('../view/login.pug'),
      escapeToClose: false
    })
  }

  $scope.start()
}])
