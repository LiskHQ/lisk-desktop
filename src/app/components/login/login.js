
import crypto from 'crypto'
import mnemonic from 'bitcore-mnemonic'

import './login.less'
import './save.less'

app.component('login', {
  template: require('./login.jade')(),
  bindings: {
    passphrase: '=',
    onLogin: '&',
  },
  controller: class login {
    constructor ($scope, $rootScope, $timeout, $document, $mdDialog, $mdMedia) {
      this.$scope = $scope
      this.$rootScope = $rootScope
      this.$timeout = $timeout
      this.$document = $document
      this.$mdDialog = $mdDialog
      this.$mdMedia = $mdMedia

      this.$scope.$watch('$ctrl.input_passphrase', this.isValid.bind(this))
      // this.$timeout(this.devTestAccount.bind(this), 200)

      this.$scope.$watch(() => {
        return this.$mdMedia('xs') || this.$mdMedia('sm');
      }, (wantsFullScreen) => {
        this.$scope.customFullscreen = wantsFullScreen === true
      })
    }

    reset () {
      this.input_passphrase = ''
      this.progress = 0
      this.seed = this.emptyBytes().map(v => '00')
    }

    stop () {
      this.random = false
      this.$document.unbind('mousemove', this.listener)
    }

    go () {
      this.passphrase = this.fix(this.input_passphrase)

      this.reset()
      this.$timeout(this.onLogin)
    }

    isValid (value) {
      value = this.fix(value)

      if (value === '') {
        this.valid = 2
      } else if (value.split(' ').length !== 12 || !mnemonic.isValid(value)) {
        this.valid = 0
      } else {
        this.valid = 1
      }
    }

    start () {
      this.reset()

      this.random = true

      let last = [0, 0]
      let used = this.emptyBytes()

      let turns = 5
      let steps = 2
      let total = turns * used.length
      let count = 0

      this.listener = (ev) => {
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

            this.$scope.$apply(() => {
              this.seed[pos] = this.lpad(crypto.randomBytes(1)[0].toString(16), '0', 2)
              this.progress = parseInt(count / total * 100)
            })

            if (count >= total) {
              this.$timeout(() => {
                this.stop()
                this.setNew()
              })

              return
            }
          }
        }
      }

      this.$timeout(() => this.$document.mousemove(this.listener), 300)
    }

    setNew () {
      let passphrase = (new mnemonic(new Buffer(this.seed.join(''), 'hex'))).toString()
      let ok = () => this.input_passphrase = passphrase

      this.$mdDialog.show({
        controllerAs: '$ctrl',
        controller: /*@ngInject*/ class save {
          constructor ($scope, $mdDialog) {
            this.$mdDialog = $mdDialog
            this.passphrase = passphrase

            $scope.$watch('$ctrl.missing_input', () => {
              this.missing_ok = this.missing_input && this.missing_input === this.missing_word
            })
          }

          next () {
            this.enter = true

            let words = this.passphrase.split(' ')
            let missing_number = parseInt(Math.random() * words.length)

            this.missing_word = words[missing_number]
            this.pre = words.slice(0, missing_number).join(' ')
            this.pos = words.slice(missing_number + 1).join(' ')
          }

          ok () {
            ok()
            this.close()
          }

          close () {
            this.$mdDialog.hide()
          }
        },

        template: require('./save.jade')(),
        fullscreen: (this.$mdMedia('sm') || this.$mdMedia('xs'))  && this.$scope.customFullscreen
      })
    }

    devTestAccount () {
      this.input_passphrase = 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive'
      this.$timeout(this.go.bind(this), 100)
    }

    fix (v) {
      return (v || '').replace(/ +/g, ' ').trim().toLowerCase()
    }

    lpad (str, pad, length) {
      while (str.length < length) str = pad + str
      return str
    }

    emptyBytes () {
      return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  }
})
