
import './login.less'

import crypto from 'crypto'
import mnemonic from 'bitcore-mnemonic'

export default (app) => {
  let fix = v => {
    return (v || '').replace(/ +/g, ' ').trim().toLowerCase()
  }

  let lpad = (str, pad, length) => {
    while (str.length < length) str = pad + str
    return str
  }

  app.directive('login', ($document, $timeout) => {
    return {
      restrict: 'E',
      template: require('./login.pug'),
      scope: {},
      link (scope, elem, attrs) {
        scope.focus = () => {
          elem.find('input').focus()
        }
      },
      controller ($scope, $rootScope) {
        $scope.passphrase = {
          isValid (value) {
            value = fix(value)

            if (value === '') {
              $scope.passphrase.valid = 2
            } else if (value.split(' ').length !== 12 || !mnemonic.isValid(value)) {
              $scope.passphrase.valid = 0
            } else {
              $scope.passphrase.valid = 1
            }
          }
        }

        $scope.$watch('passphrase.value', $scope.passphrase.isValid)

        $scope.random = {
          empty () {
            return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          reset () {
            $scope.random.progress = 0
            $scope.random.tmp = $scope.random.empty()
          },
          stop () {
            $scope.random.started = false
            $document.unbind('mousemove', $scope.random.listener)
          },
          start () {
            $scope.random.started = true

            $scope.reset()
            $scope.random.reset()

            let last = [0, 0]
            let used = $scope.random.empty()

            let turns = 2 // 10 + parseInt(Math.random() * 10)
            let steps = 1
            let total = turns * used.length
            let count = 0

            console.log('entropy', { turns, steps, total })

            $scope.random.listener = (ev) => {
              let distance = Math.sqrt(Math.pow(ev.pageX - last[0], 2) + Math.pow(ev.pageY - last[1], 2))

              if (distance > 60) {
                for (let p = 0; p < steps; p++) {
                  let pos
                  let available = []

                  for (let i in used) {
                    if (!used[i]) {
                      available.push(i)
                    }
                  }

                  if (!available.length) {
                    used = used.map(v => 0)
                    pos = parseInt(Math.random() * used.length)
                  } else {
                    pos = available[parseInt(Math.random() * available.length)]
                  }

                  count++

                  last = [ev.pageX, ev.pageY]
                  used[pos] = 1

                  $scope.$apply(() => {
                    $scope.random.tmp[pos] = crypto.randomBytes(1)[0]
                    $scope.random.progress = parseInt(count / total * 100)
                  })

                  if (count >= total) {
                    $timeout(() => {
                      let hex = $scope.random.tmp.map(v => lpad(v.toString(16), '0', 2)).join('')
                      $scope.passphrase.value = (new mnemonic(new Buffer(hex, 'hex'))).toString()

                      $scope.random.stop()
                    })

                    return
                  }
                }
              }
            }

            $timeout(() => $document.mousemove($scope.random.listener), 300)
          }
        }

        $scope.reset = () => {
          $scope.passphrase.value = ''
        }

        $scope.login = () => {
          $rootScope.$broadcast('start', $scope.passphrase.value)
        }
      }
    }
  })
}
