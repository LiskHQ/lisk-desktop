
import './top.less'

import app from '../../app'

app.directive('top', () => {
  return {
    restrict: 'E',
    template: require('./top.jade'),
    scope: { account: '=', peer: '=' },
    controller: ($scope) => {}
  }
})
