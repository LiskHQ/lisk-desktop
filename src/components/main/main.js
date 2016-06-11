
import './main.less'

import lisk from 'lisk-js'

import app from '../../app'

const UPDATE_INTERVAL_BALANCE = 5000

app.directive('main', ($timeout, $q, peers) => {
  return {
    restrict: 'E',
    template: require('./main.jade'),
    scope: {},
    link (scope, elem, attrs) {},
    controller: ($scope, $log, $mdToast) => {
      $scope.timeouts = {}

      $scope.only_official = true

      $scope.$on('prelogin', () => {
        $scope.prelogged = true

        let kp = lisk.crypto.getKeys($scope.passphrase)

        $scope.peer = peers.random($scope.only_official)
        $scope.address = lisk.crypto.getAddress(kp.publicKey)
        $scope.publicKey = kp.publicKey

        $log.info('session peer %s', $scope.peer.uri)

        $scope.updateBalance()
          .then(() => {
            $scope.prelogged = false
            $scope.logged = true
            $scope.$emit('login')
          })
      })

      $scope.$on('error', () => {
        $mdToast.show($mdToast.simple().textContent(`Error connecting to the peer ${$scope.peer.url}`).position('bottom right'))
        $scope.logout()
      })

      $scope.updateBalance = () => {
        return $scope.peer.getBalance($scope.address)
          .then(balance => {
            $scope.balance = balance

            if ($scope.prelogged || $scope.logged) {
              $scope.timeouts.balance = $timeout($scope.updateBalance, UPDATE_INTERVAL_BALANCE)
            }
          })
          .catch(() => {
            $scope.$emit('error')
            return $q.reject()
          })
      }

      $scope.logout = () => {
        $scope.$emit('logout')
      }

      $scope.$on('logout', () => {
        $scope.logged = false
        $scope.prelogged = false

        for (let name in $scope.timeouts) {
          $timeout.cancel($scope.timeouts[name])
        }
      })
    }
  }
})
