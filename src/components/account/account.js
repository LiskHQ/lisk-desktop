
import './account.less'

import app from '../../app'

app.directive('account', () => {
  return {
    restrict: 'E',
    template: require('./account.jade'),
    link (scope, elem, attrs) {},
    controller: ($scope) => {}
  }
})
