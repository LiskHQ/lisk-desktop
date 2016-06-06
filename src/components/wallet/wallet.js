
import './wallet.less'

import lisk from 'lisk-js'

import app from '../../app'

app.directive('wallet', () => {
  return {
    restrict: 'E',
    template: require('./wallet.jade'),
    link (scope, elem, attrs) {},
    controller: ($scope) => {
      $scope.$watch('passphrase', () => {
        if (!$scope.passphrase) {
          $scope.address = null;
          $scope.publicKey = null;
          $scope.privateKey = null;
          return
        }

        let kp = lisk.crypto.getKeys($scope.passphrase)

        $scope.address = lisk.crypto.getAddress(kp.publicKey);
        $scope.publicKey = kp.publicKey;
        $scope.privateKey = kp.privateKey;
      })

      $scope.logout = () => {
        $scope.passphrase = null
      }
    }
  }
})
