
import crypto from 'crypto'
import mnemonic from 'bitcore-mnemonic'

import './login.less'

import app from '../../app'

app.component('login', {
  template: require('./login.jade')(),
  bindings: {
    passphrase: '=',
    peer: '=',
  },
  controller: class main {
    constructor ($scope, $timeout, $q, $document, peers) {
      this.$scope = $scope
      this.$timeout = $timeout
      this.$q = $q
      this.$document = $document
      this.peers = peers

      this.peers = this.peers.official

      this.$scope.$on('logout', () => {
        this.input_passphrase = null
      })

      this.$scope.$watch('$ctrl.input_passphrase', this.isValid.bind(this))
      // this.$timeout(this.devTestAccount.bind(this))
    }

    reset () {
      this.input_passphrase = ''
      this.progress = 0
      this.seed = this.emptyBytes().map(v => '00')
    }

    stop () {
      this.$document.unbind('mousemove', this.listener)

      this.listener = null
      this.random = false
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
                this.input_passphrase = (new mnemonic(new Buffer(this.seed.join(''), 'hex'))).toString()
              })

              return
            }
          }
        }
      }

      this.$timeout(() => this.$document.mousemove(this.listener), 300)
    }

    go () {
      this.passphrase = this.fix(this.input_passphrase)
      this.reset()
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
