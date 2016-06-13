
import './lsk.less'

import numeral from 'numeral'

import app from '../../app'

app.directive('lsk', () => {
  return {
    restrict: 'C',
    template: require('./lsk.jade'),
    scope: { data: '=' },
    link (scope, elem, attrs) {},
    controller: ($scope) => {
      let fix = value => {
        return numeral(parseInt(value) || 0).divide(Math.pow(10, 8)).format('0.00000000')
      }

      $scope.$watch('data', () => {
        $scope.amount = fix($scope.data)
      })
    }
  }
})
