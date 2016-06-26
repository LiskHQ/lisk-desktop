
import './transactions.less'

import app from '../../app'

const UPDATE_INTERVAL = 10000

app.component('transactions', {
  template: require('./transactions.jade')(),
  bindings: {
    account: '=',
  },
  controller: class transactions {
    constructor ($scope, $timeout, $q, $peers) {
      this.$scope = $scope
      this.$timeout = $timeout
      this.$q = $q
      this.$peers = $peers

      this.reset()
      this.updateTransactions()

      this.$scope.$on('peerUpdate', () => {
        this.reset()
        this.updateTransactions()
      })
    }

    $onDestroy () {
      this.$timeout.cancel(this.timeout)
    }

    reset () {
      this.transactions = []
    }

    updateTransactions (more) {
      if (more) {
        this.loading_more = true
      }

      this.$timeout.cancel(this.timeout)

      let limit = (this.transactions.length || 10) + (more ? 10 : 0)

      if (limit < 10) {
        limit = 10
      }

      return this.$peers.active.getTransactions(this.account.address, limit)
        .then(res => {
          this.transactions = res.transactions
          this.total = res.count

          if (this.total > this.transactions.length) {
            this.more = this.total - this.transactions.length
          } else {
            this.more = 0
          }

          if (more) {
            this.loading_more = false
          }

          this.timeout = this.$timeout(this.updateTransactions.bind(this), UPDATE_INTERVAL)
        })
        .catch(() => {
          return this.$q.reject()
        })
    }
  }
})
