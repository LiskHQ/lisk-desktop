
import './lsk.less'

import app from '../../app'

app.directive('lsk', () => {
  return {
    restrict: 'C',
    template: require('./lsk.jade'),
    scope: { amount: '=', negative: '=?' },
    link (scope, elem, attrs) {},
    controller: ($scope, $attrs, lsk) => {
      $scope.nocolor = typeof $attrs.nocolor !== 'undefined'

      $scope.$watch('amount', () => {
        $scope._amount = lsk.normalize($scope.amount)
      })
    }
  }
})
