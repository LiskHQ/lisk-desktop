
import './data.less'

import app from '../../app'

app.directive('data', ($timeout, $http) => {
  let updates = {
    balance (data, cb) {
      $http.get('https://login.lisk.io/api/accounts/getBalance?address=' + data).then(
        (res) => {
          cb(null, res.data.balance)
        },
        (res) => {
          cb('error')
        }
      )
    },
    unconfirmedBalance (data, cb) {
      $http.get('https://login.lisk.io/api/accounts/getBalance?address=' + data).then(
        (res) => {
          cb(null, res.data.unconfirmedBalance)
        },
        (res) => {
          cb('error')
        }
      )
    }
  }

  return {
    restrict: 'E',
    template: require('./data.jade'),
    scope: { type: '@', data: '=', time: '@' },
    link (scope, elem, attrs) {},
    controller: ($scope) => {
      $scope.value = '...'

      $scope.update = () => {
        if ($scope.disabled) {
          return
        }

        $scope.disabled = true

        $timeout.cancel($scope.timer)

        updates[$scope.type]($scope.data, (err, data) => {
          $scope.disabled = false
          $scope.value = data

          $scope.timer = $timeout($scope.update, $scope.time * 1000)
        })
      }

      $scope.update()

      $scope.$on('$destroy', () => {
        $timeout.cancel($scope.timer)
      })
    }
  }
})
