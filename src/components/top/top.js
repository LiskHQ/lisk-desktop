
import './top.less'

import app from '../../app'

app.component('top', {
  template: require('./top.jade')(),
  bindings: {
    account: '=',
    peer: '=',
  },
  controller: class main {
    constructor (peers) {
      this.ricardo = 123
      this.peers = peers.official
    }
  }
})
