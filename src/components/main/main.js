
import './main.less'

import lisk from 'lisk-js'

import app from '../../app'

const UPDATE_INTERVAL_BALANCE = 5000

app.component('main', {
  template: require('./main.jade')(),
  controller: class main {
    constructor ($scope, $rootScope, $timeout, $q, $peers, error) {
      this.$scope = $scope
      this.$rootScope = $rootScope
      this.$timeout = $timeout
      this.$q = $q
      this.$peers = $peers
      this.error = error

      this.$scope.$watch('$ctrl.passphrase', this.login.bind(this))
      this.$scope.$on('peerUpdate', this.updateAccount.bind(this))
      this.$scope.$on('error', this.onError.bind(this))

      $scope.$watch('$ctrl.$peers.active', (peer, old) => {
        if (peer != old) {
          this.$rootScope.$broadcast('peerUpdate')
        }
      })
    }

    login () {
      if (this.passphrase) {
        this.prelogged = true

        this.$peers.setActive()

        let kp = lisk.crypto.getKeys(this.passphrase)
        this.address = lisk.crypto.getAddress(kp.publicKey)

        this.updateAccount()
          .then(() => {
            this.prelogged = false
            this.logged = true
          })
      } else {
        this.logged = false
        this.prelogged = false
        this.passphrase = ''

        this.$timeout.cancel(this.timeout)
      }
    }

    logout () {
      this.passphrase = ''
      this.account = {}
    }

    updateAccount () {
      this.$timeout.cancel(this.timeout)

      return this.$peers.active.getAccount(this.address)
        .then(res => {
          this.account = res

          if (this.prelogged || this.logged) {
            this.timeout = this.$timeout(this.updateAccount.bind(this), UPDATE_INTERVAL_BALANCE)
          }
        })
        .catch(() => {
          this.$scope.$emit('error')
          return this.$q.reject()
        })
    }

    onError () {
      this.logout()
      this.error.dialog({ text: `Error connecting to the peer ${this.peer.url}` })
    }

    getPeerSelectedText () {
      return `Peer: ${this.peer.host}`
    }
  }
})
