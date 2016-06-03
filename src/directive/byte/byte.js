
import './byte.less'

export default (app) => {
  let lpad = (str, pad, length) => {
    while (str.length < length) str = pad + str
    return str
  }

  app.directive('byte', () => {
    return {
      restrict: 'E',
      template: require('./byte.pug'),
      scope: { data: '=ngData' },
      link (scope, elem, attrs) {
        scope.$watch('data', (nv) => {
          scope.dec = lpad(nv.toString(), '0', 3)
          scope.hex = lpad(nv.toString(16), '0', 2)
        })
      }
    }
  })
}
