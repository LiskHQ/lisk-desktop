
import './top.less'

import app from '../../app'

app.directive('top', () => {
  return {
    restrict: 'E',
    template: require('./top.jade'),
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
