
import './lsk.less'

import app from '../../app'

app.directive('lsk', () => {
  return {
    restrict: 'C',
    template: require('./lsk.jade'),
    scope: { amount: '=', fee: '=?', negative: '=?' },
    link (scope, elem, attrs) {},
    controller: ($scope, lsk) => {
      $scope.fee = $scope.fee ? lsk.normalize($scope.fee) : null

      $scope.$watch('amount', () => {
        $scope.value = lsk.normalize($scope.amount)
      })
    }
  }
})
