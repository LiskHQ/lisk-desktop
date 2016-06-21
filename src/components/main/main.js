
import './main.less'

import lisk from 'lisk-js'

import app from '../../app'

const UPDATE_INTERVAL_BALANCE = 5000

app.directive('main', ($timeout, $q, peers) => {
  return {
    restrict: 'E',
    template: require('./main.jade'),
    scope: {},
    controller: ($scope, $log, error) => {
      $scope.$on('prelogin', () => {
        $scope.prelogged = true

        let kp = lisk.crypto.getKeys($scope.passphrase)

        $scope.peer = $scope.peer_selected || peers.random()
        $scope.address = lisk.crypto.getAddress(kp.publicKey)

        $scope.updateAccount()
          .then(() => {
            $scope.prelogged = false
            $scope.logged = true
          })
      })

      $scope.$on('error', () => {
        $scope.logout()
        error.dialog({ text: `Error connecting to the peer ${$scope.peer.url}` })
      })

      $scope.updateAccount = () => {
        $timeout.cancel($scope.timeout)

        return $scope.peer.getAccount($scope.address)
          .then(res => {
            $scope.account = res

            if ($scope.prelogged || $scope.logged) {
              $scope.timeout = $timeout($scope.updateAccount, UPDATE_INTERVAL_BALANCE)
            }
          })
          .catch(() => {
            $scope.$emit('error')
            return $q.reject()
          })
      }

      $scope.logout = () => {
        $scope.logged = false
        $scope.prelogged = false
        $scope.passphrase = ''

        $timeout.cancel($scope.timeout)
      }
    }
  }
})
