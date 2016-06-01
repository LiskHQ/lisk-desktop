
export default (app) => {
  app.controller('main', ['$scope', '$mdDialog', ($scope, $mdDialog) => {
    $scope.start = (ev) => {
      $mdDialog.show({
        template: '<login />',
        escapeToClose: false,
      })
    }

    $scope.start()
  }])
}
