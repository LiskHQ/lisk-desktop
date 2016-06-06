
import './history.less'

import app from '../../app'

app.directive('history', () => {
  return {
    restrict: 'E',
    template: require('./history.jade'),
    link (scope, elem, attrs) {},
    controller: ($scope) => {}
  }
})
