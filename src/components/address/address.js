
import './address.less'

import app from '../../app'

app.directive('address', () => {
  return {
    restrict: 'C',
    template: require('./address.jade'),
    scope: { data: '=' },
    link (scope, elem, attrs) {},
    controller: ($scope) => {}
  }
})
