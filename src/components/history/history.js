
import './history.less'

import app from '../../app'

const UPDATE_INTERVAL = 30000

app.directive('history', ($timeout) => {
  return {
    restrict: 'E',
    template: require('./history.jade'),
    link (scope, elem, attrs) {
      elem.hide()

      scope.$on('login', () => {
        elem.show()
        scope.updateHistory()
      })

      scope.$on('logout', () => {
        elem.hide()
        scope.history = []
      })
    },
    controller: ($scope) => {
      $scope.updateHistory = () => {
        return $scope.peer.getHistory($scope.address)
          .then(res => {
            $scope.history = res

            if ($scope.prelogged || $scope.logged) {
              $scope.timeouts.history = $timeout($scope.updateHistory, UPDATE_INTERVAL)
            }
          })
          .catch(() => {
            $scope.$emit('error')
            return $q.reject()
          })
      }
    }
  }
})
