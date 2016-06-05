
import './wallet.less'
import './send/send'
import './account/account'

import app from '../../app'

app.directive('wallet', () => {
  return {
    restrict: 'E',
    template: require('./wallet.pug'),
    link (scope, elem, attrs) {
    },
    controller: ($scope, account, login) => {
      $scope.$watch('passphrase_active', (value) => {
        if (value) {
          $scope.account = account($scope.passphrase_active)
        }
      })

      $scope.close = () => {
        login.start($scope)
      }
    }
  }
})
