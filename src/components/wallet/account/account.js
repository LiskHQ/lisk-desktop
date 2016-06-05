
import './account.less'

import app from '../../../app'

app.directive('account', () => {
  return {
    restrict: 'E',
    template: require('./account.pug'),
    link (scope, elem, attrs) {
    },
    controller: ($scope) => {
    }
  }
})
