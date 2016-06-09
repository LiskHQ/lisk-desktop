
import './history.less'

import app from '../../app'

app.directive('history', () => {
  return {
    restrict: 'E',
    template: require('./history.jade'),
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
