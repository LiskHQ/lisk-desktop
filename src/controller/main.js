
export default (app) => {
  app.controller('main', ($scope, $rootScope, $mdDialog) => {
    $scope.start = (ev) => {
      $mdDialog.show({
        template: '<login />',
        parent: angular.element(document.body),
        escapeToClose: false,
        clickOutsideToClose: false,
        hasBackdrop: false,
        fullscreen: true,
        autoWrap: false,
      })
    }

    $scope.start()

    $rootScope.$on('start', (ev, v) => {
      $mdDialog.show({
        template: '<wallet />',
        parent: angular.element(document.body),
        escapeToClose: false,
        clickOutsideToClose: false,
        hasBackdrop: false,
        fullscreen: true,
        autoWrap: false,
      })
    })

    $rootScope.$on('close', (ev, v) => {
      $scope.start()
    })
  })
}
