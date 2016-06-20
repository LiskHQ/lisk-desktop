
import numeral from 'numeral'

import app from '../app'

app.factory('timestamp', () => {
  return {
    fix (value) {
      return new Date((((Date.UTC(2016, 4, 24, 17, 0, 0, 0) / 1000) + value) * 1000))
    }
  }
})
