
import './login.less'

import mnemonic from 'bitcore-mnemonic'

export default (app) => {
  let fix = v => v.replace(/ +/g, ' ').trim().toLowerCase()

  app.directive('login', () => {
    return {
      restrict: 'E',
      template: require('./login.pug'),
      scope: {},
      link (scope, elem, attrs) {
        scope.validPassphrase = (ev) => {
          let value = fix(scope.passphrase)

          if (value.split(' ').length !== 12 || !mnemonic.isValid(value)) {
            scope.valid = false
          }
          else {
            scope.valid = true

            if (ev.keyCode === 13) {
              // ok
            }
          }
        }
      },
      controller () {

      }
    }
  })
}
