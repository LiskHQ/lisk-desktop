
import './transactions.less'

import app from '../../app'

const UPDATE_INTERVAL = 10000

app.directive('transactions', ($timeout, $q) => {
  return {
    restrict: 'E',
    template: require('./transactions.jade'),
    scope: { address: '=', peer: '=' },
    link (scope, elem, attrs) {},
    controller: ($scope) => {
      $scope.transactions = []

      $scope.updateTransactions = (more) => {
        if (more) {
          $scope.loading_more = true
        }

        $timeout.cancel($scope.timeout)

        return $scope.peer.getTransactions($scope.address, ($scope.transactions.length || 10) + (more ? 10 : 0))
          .then(res => {
            $scope.transactions = res.transactions
            $scope.total = res.count

            if ($scope.total > $scope.transactions.length) {
              $scope.more = $scope.total - $scope.transactions.length
            } else {
              $scope.more = 0
            }

            if (more) {
              $scope.loading_more = false
            }

            $scope.timeout = $timeout($scope.updateTransactions, UPDATE_INTERVAL)
          })
          .catch(() => {
            return $q.reject()
          })
      }

      $scope.updateTransactions()

      $scope.$on('$destroy', () => {
        $timeout.cancel($scope.timeout)
      })
    }
  }
})
