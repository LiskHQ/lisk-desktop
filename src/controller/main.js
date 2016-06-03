
export default (app) => {
  app.controller('main', ($scope, $rootScope, $mdDialog) => {
    $scope.start = (ev) => {
      $mdDialog.show({
        template: '<login />',
        escapeToClose: false,
        clickOutsideToClose: false,
        hasBackdrop: false,
      })
    }

    $scope.start()

    $rootScope.$on('start', (ev, v) => {
      $mdDialog.show({
        template: '<wallet />',
        parent: angular.element(document.body),
        escapeToClose: false,
        clickOutsideToClose: false,
        fullscreen: true,
        hasBackdrop: false,
      })
    })

    $rootScope.$on('close', (ev, v) => {
      $scope.start()
    })
  })
}
