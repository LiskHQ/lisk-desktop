
import app from '../app'

const API_PEERS = '/api/peers'
const UPDATE_INTERVAL = 60000

app.factory('peers', ($log, $q, $timeout, peer) => {
  class peers {
    constructor () {
      this.public = []
      this.official = [
        new peer({ host: 'login.lisk.io', https: true }),
        // new peer({ host: 'lisk.fullstack.me' }),
      ]

      this.update()
    }

    random (official = true) {
      let stack = (official || !this.public.length) ? this.official : this.public
      return stack[parseInt(Math.random() * stack.length)]
    }

    update () {
      this.random(true).get(API_PEERS, { state: 2 })
        .then(
          (res) => {
            this.public = res.data.peers.map(obj => {
              return new peer({
                host: obj.ip,
                port: obj.port,
                https: false,
              })
            })

            $log.info('loaded %s peers', this.public.length)
          }
        )
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
