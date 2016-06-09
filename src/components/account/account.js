
import './account.less'

import app from '../../app'

app.directive('account', () => {
  return {
    restrict: 'E',
    template: require('./account.jade'),
    link (scope, elem, attrs) {
      elem.hide()

      scope.$on('login', () => {
        elem.show()
      })

      scope.$on('logout', () => {
        elem.hide()
      })
    },
    controller: ($scope) => {}
  }
})
