
import app from '../app'

app.filter('timestamp', (epochStampFilter) => {
  return (timestamp) => {
    let d = epochStampFilter(timestamp)
    let month = d.getMonth() + 1

    if (month < 10) {
      month = '0' + month
    }

    let day = d.getDate()

    if (day < 10) {
      day = '0' + day
    }

    let h = d.getHours()
    let m = d.getMinutes()
    let s = d.getSeconds()

    if (h < 10) {
      h = '0' + h
    }

    if (m < 10) {
      m = '0' + m
    }

    if (s < 10) {
      s = '0' + s
    }

    return d.getFullYear() + '/' + month + '/' + day + ' ' + h + ':' + m + ':' + s
  }
})
