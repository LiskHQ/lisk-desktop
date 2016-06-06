
import crypto from 'crypto'
import mnemonic from 'bitcore-mnemonic'

import './login.less'

import app from '../../app'

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
    template: require('./login.jade'),
    link (scope, elem, attrs) {
      scope.focus = () => {
        elem.find('input').focus()
      }
    },
    controller: ($scope) => {
      $scope.login = {
        empty () {
          return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        reset () {
          $scope.login.passphrase = 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive'
          // $scope.login.passphrase = ''
          $scope.login.progress = 0
          $scope.login.tmp = $scope.login.empty().map(v => '00')
        },
        stop () {
          $scope.login.onRandom = false
          $document.unbind('mousemove', $scope.listener)
        },
        isValid (value) {
          value = fix(value)

          if (value === '') {
            $scope.login.valid = 2
          } else if (value.split(' ').length !== 12 || !mnemonic.isValid(value)) {
            $scope.login.valid = 0
          } else {
            $scope.login.valid = 1
          }
        },
        start () {
          $scope.login.reset()

          $scope.login.onRandom = true

          let last = [0, 0]
          let used = $scope.login.empty()

          let turns = 2
          let steps = 1
          let total = turns * used.length
          let count = 0

          console.log('entropy', { turns, steps, total })

          $scope.login.listener = (ev) => {
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
                  $scope.login.tmp[pos] = lpad(crypto.randomBytes(1)[0].toString(16), '0', 2)
                  $scope.login.progress = parseInt(count / total * 100)
                })

                if (count >= total) {
                  $timeout(() => {
                    let hex = $scope.login.tmp.join('')
                    $scope.login.passphrase = (new mnemonic(new Buffer(hex, 'hex'))).toString()

                    $scope.login.stop()
                  })

                  return
                }
              }
            }
          }

          $timeout(() => $document.mousemove($scope.login.listener), 300)
        }
      }

      $scope.$watch('login.passphrase', $scope.login.isValid)

      $scope.go = () => {
        $scope.passphrase = $scope.login.passphrase
        $scope.login.reset()
      }
    }
  }
})
