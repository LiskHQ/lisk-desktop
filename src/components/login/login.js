
import crypto from 'crypto'
import mnemonic from 'bitcore-mnemonic'

import './login.less'

import app from '../../app'

app.directive('login', ($document, $timeout) => {
  return {
    restrict: 'E',
    template: require('./login.jade'),
    link (scope, elem, attrs) {
      elem.find('input').focus()
    },
    controller: ($scope) => {
      let fix = v => {
        return (v || '').replace(/ +/g, ' ').trim().toLowerCase()
      }

      let lpad = (str, pad, length) => {
        while (str.length < length) str = pad + str
        return str
      }

      let emptyBytes = () => {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }

      $scope.login = {
        reset () {
          $scope.login.passphrase = ''
          $scope.login.progress = 0
          $scope.login.seed = emptyBytes().map(v => '00')
        },
        stop () {
          $document.unbind('mousemove', $scope.login.listener)

          $scope.login.listener = null
          $scope.login.random = false
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

          $scope.login.random = true

          let last = [0, 0]
          let used = emptyBytes()

          let turns = 5
          let steps = 2
          let total = turns * used.length
          let count = 0

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
                  $scope.login.seed[pos] = lpad(crypto.randomBytes(1)[0].toString(16), '0', 2)
                  $scope.login.progress = parseInt(count / total * 100)
                })

                if (count >= total) {
                  $timeout(() => {
                    $scope.login.stop()
                    $scope.login.passphrase = (new mnemonic(new Buffer($scope.login.seed.join(''), 'hex'))).toString()
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
        $scope.passphrase = fix($scope.login.passphrase)
        $scope.login.reset()
        $scope.$emit('prelogin')
      }

      $scope.devTestAccount = () => {
        $scope.login.passphrase = 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive'
        $timeout($scope.go, 250)
      }

      $scope.$on('logout', () => {
        $scope.passphrase = null
      })
    }
  }
})
