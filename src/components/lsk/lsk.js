
import './lsk.less'

import app from '../../app'

app.component('lsk', {
  template: require('./lsk.jade')(),
  bindings: {
    amount: '<',
    negative: '<?',
  },
  controller: class lsk {
    constructor ($attrs) {
      this.nocolor = typeof $attrs.nocolor !== 'undefined'
    }
  }
})
