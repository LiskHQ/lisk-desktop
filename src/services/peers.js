
import app from '../app'

const UPDATE_INTERVAL = 60000

app.factory('peers', ($log, $q, $timeout, peer) => {
  class peers {
    constructor () {
      this.official = [
        new peer({ host: 'node01.lisk.io' }),
        new peer({ host: 'node02.lisk.io' }),
        new peer({ host: 'node03.lisk.io' }),
        new peer({ host: 'node04.lisk.io' }),
        new peer({ host: 'node05.lisk.io' }),
        new peer({ host: 'node06.lisk.io' }),
        new peer({ host: 'node07.lisk.io' }),
        new peer({ host: 'node08.lisk.io' }),
      ]
    }

    random (type) {
      return this.official[parseInt(Math.random() * this.official.length)]
    }
  }

  return new peers()
})
