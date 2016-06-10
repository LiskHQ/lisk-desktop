
import './main.less'

import lisk from 'lisk-js'

import app from '../../app'

app.directive('main', ($timeout, peer) => {
  return {
    restrict: 'E',
    template: require('./main.jade'),
    scope: {},
    link (scope, elem, attrs) {},
    controller: ($scope) => {
      $scope.$on('prelogin', () => {
        $scope.prelogged = true

        let kp = lisk.crypto.getKeys($scope.passphrase)

        $scope.address = lisk.crypto.getAddress(kp.publicKey)
        $scope.publicKey = kp.publicKey

        peer.session()

        $scope.balance.update(() => {
          $scope.prelogged = false
          $scope.logged = true
          $scope.$emit('login')
          $scope.balance.call()
        })
      })

      $scope.balance = {
        update (cb) {
          peer.getBalance($scope.address, (value) => {
            $scope.balance.value = value

            if (typeof cb === 'function') {
              cb(value)
            }
          })
        },
        call () {
          $scope.balance.timeout = $timeout($scope.balance.start, 5000)
        },
        start () {
          $scope.balance.update($scope.balance.call)
        }
      }

      $scope.logout = () => {
        $scope.$emit('logout')
      }

      $scope.$on('logout', () => {
        $timeout.cancel($scope.balance.timeout)
        $scope.logged = false
        $scope.prelogged = false
      })
    }
  }
})
