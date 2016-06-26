
import './send.less'

import app from '../../app'

const ADDRESS_VALID_RE = '^[0-9]{1,21}[L|l]$'
const AMOUNT_VALID_RE = '^[0-9]+(\.[0-9]{1,8})?$'

app.component('send', {
  template: require('./send.jade')(),
  bindings: {
    passphrase: '<',
  },
  controller: class send {
    constructor ($peers, success, error) {
      this.$peers = $peers
      this.success = success
      this.error = error

      this.recipient = {
        regexp: ADDRESS_VALID_RE,
      }

      this.amount = {
        regexp: AMOUNT_VALID_RE,
      }
    }

    reset () {
      this.recipient.value = ''
      this.amount.value = ''
    }

    go () {
      this.loading = true

      this.$peers.active.sendTransaction(
        this.passphrase,
        this.secondPassphrase,
        this.recipient.value,
        this.amount.value
      )
      .then(
        (res) => {
          return this.success.dialog({ text: `${this.amount.value} sent to ${this.recipient.value}` })
            .then(() => {
              this.reset()
            })
        },
        (res) => {
          this.error.dialog({ text: res && res.message ? res.message : 'An error occurred while sending the transaction.' })
        }
      )
      .finally(() => {
        this.loading = false
      })
    }
  }
})
