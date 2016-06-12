
import app from '../app'

const UPDATE_INTERVAL = 60000

app.factory('peers', ($log, $q, $timeout, peer) => {
  class peers {
    constructor () {
      this.unnofficial = []

      this.official = [
        new peer({ host: 'login.lisk.io', ssl: true }),
      ]

      this.test = [
        new peer({ host: 'testnet.lisk.io', ssl: true }),
      ]

      this.update()
    }

    random (type) {
      let stack

      if (type == 3) {
        stack = this.test
      } else if (type == 2 && this.unnofficial.length) {
        stack = this.unnofficial
      } else {
        stack = this.official
      }

      return stack[parseInt(Math.random() * stack.length)]
    }

    update () {
      this.random(1).getPeers()
        .then(res => {
          this.unnofficial = res.map(obj => {
            return new peer({ host: obj.ip, port: obj.port })
          })
        })
        .finally(() => {
          $timeout(this.update.bind(this), UPDATE_INTERVAL)
        })
    }
  }

  return new peers()
})
