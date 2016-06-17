
import './top.less'

import app from '../../app'

app.directive('top', () => {
  return {
    restrict: 'E',
    template: require('./top.jade'),
    link (scope, elem, attrs) {},
    controller: ($scope) => {}
  }
})
