
import './wallet.less'

import app from '../../app'

app.directive('wallet', () => {
  return {
    restrict: 'E',
    template: require('./wallet.pug'),
    link (scope, elem, attrs) {},
    controller: ($scope, account) => {
      $scope.$watch('passphrase_active', (value) => {
        if (value) {
          $scope.account = account($scope.passphrase_active)
        }
      })
    }
  }
})
