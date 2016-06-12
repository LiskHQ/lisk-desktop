
import app from '../app'

const UPDATE_INTERVAL = 60000

app.factory('peers', ($log, $q, $timeout, peer) => {
  class peers {
    constructor () {
      this.unnofficial = []
      this.official = [
        new peer({ host: 'testnet.lisk.io', ssl: true }),
        // new peer({ host: 'login.lisk.io', ssl: true }),
        // new peer({ host: 'lisk.fullstack.me' }),
      ]

      this.update()
    }

    random (official = true) {
      let stack = (official || !this.unnofficial.length) ? this.official : this.unnofficial
      return stack[parseInt(Math.random() * stack.length)]
    }

    update () {
      this.random(true).getPeers()
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

// app.config($httpProvider => {
//   $httpProvider.interceptors.push(($q, $injector) => {
//     return {
//       responseError: (rej) => {
//         let peer = $injector.get('peer')
//         let $http = $injector.get('$http')
//
//         peer.session()
//         rej.config.endpoint = peer.endpoint
//
//         if (typeof rej.config.counter == 'undefined') {
//           rej.config.counter = 0
//         }
//
//         rej.config.counter++
//
//         if (rej.config.counter > 2) {
//           return $q.reject(rej)
//         }
//
//         dbg('trying %s %s', peer.endpoint, rej.config.counter)
//
//         return peer.http(rej.config)
//       }
//     }
//   })
// })
