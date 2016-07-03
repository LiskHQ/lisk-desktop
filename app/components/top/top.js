
import './top.less'

import app from '../../app'

app.component('top', {
  template: require('./top.jade')(),
  bindings: {
    account: '<',
  },
  controller: class top {
    constructor ($peers) {
      this.$peers = $peers
    }
  }
})
