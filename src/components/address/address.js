
import './address.less'

import app from '../../app'

app.component('address', {
  template: require('./address.jade')(),
  bindings: { data: '<' },
})
