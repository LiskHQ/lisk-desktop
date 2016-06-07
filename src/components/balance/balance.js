
import './balance.less'

import app from '../../app'

const INTERVAL = 2000

app.directive('balance', ($timeout, $http) => {
  let data = {}
  let address = null

  let update = {
    reset() {
      data.lsk = 0
      data.usd = 0
    },
    fetch () {
      $http.get('https://explorer.lisk.io/api/getAccount?address=' + address).then(
        (res) => {
          data.lsk = res.data.balance || 0
          data.usd = res.data.usd || 0
          data.err = false

          update.timer = $timeout(update.fetch, INTERVAL)
        },
        (res) => {
          update.reset()
          data.err = true
          update.timer = $timeout(update.fetch, INTERVAL / 2)
        }
      )
    },
    start () {
      if (update.started) {
        return
      }

      update.started = true
      update.fetch()
    },
    stop () {
      $timeout.cancel(update.timer)
      update.reset()
      update.timer = null
      update.started = false
    },
  }

  return {
    restrict: 'E',
    template: require('./balance.jade'),
    scope: { address: '=' },
    link (scope, elem, attrs) {
      scope.usd = typeof attrs.usd !== 'undefined'
    },
    controller: ($scope) => {
      $scope.data = data

      $scope.$watch('address', () => {
        if ($scope.address === null) {
          address = null
          update.stop()
        } else {
          address = $scope.address
          update.start()
        }
      })
    }
  }
})
