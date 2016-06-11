
import './main.less'

import lisk from 'lisk-js'

import app from '../../app'

app.directive('main', ($timeout, $q, peers) => {
  return {
    restrict: 'E',
    template: require('./main.jade'),
    scope: {},
    link (scope, elem, attrs) {},
    controller: ($scope, $log, $mdToast) => {
      let timeouts = {}

      $scope.$on('prelogin', () => {
        $scope.prelogged = true

        let kp = lisk.crypto.getKeys($scope.passphrase)

        $scope.peer = peers.random()
        $scope.address = lisk.crypto.getAddress(kp.publicKey)
        $scope.publicKey = kp.publicKey

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
              timeouts.balance = $timeout($scope.updateBalance, 10000)
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

        for (let name in timeouts) {
          $timeout.cancel(timeouts[name])
        }
      })
    }
  }
})
