
import numeral from 'numeral'

import app from '../app'

app.filter('usd', () => {
  return (value) => {
    return numeral(parseInt(value) || 0).divide(Math.pow(10, 8)).format('0,0[.]00000000 $')
  }
})
