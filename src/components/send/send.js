
import './send.less'

import app from '../../app'

app.directive('send', () => {
  return {
    restrict: 'E',
    template: require('./send.jade'),
    link (scope, elem, attrs) {
    },
    controller: ($scope) => {
    }
  }
})
