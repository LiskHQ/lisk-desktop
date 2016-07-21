
import './lsk.less'

app.component('lsk', {
  template: require('./lsk.jade')(),
  bindings: {
    amount: '<',
  },
  controller: class lsk {
    constructor ($attrs) {
      this.append = typeof $attrs.append !== 'undefined'
    }
  }
})
