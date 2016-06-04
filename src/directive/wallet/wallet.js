
import './wallet.less'

export default (app) => {
  app.directive('wallet', () => {
    return {
      restrict: 'E',
      replace: true,
      template: require('./wallet.pug'),
      scope: { data: '=ngData' },
      link (scope, elem, attrs) {},
      controller: ($scope, $rootScope) => {
        $scope.close = () => {
          $rootScope.$broadcast('close')
        }
      }
    }
  })
}
