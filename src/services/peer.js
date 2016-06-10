
import path from 'path'

import debug from 'debug'

import app from '../app'

let dbg = debug('app:peer')

let peers = [
  'https://login.lisk.io',
  'https://login01.lisk.io',
  'https://login02.lisk.io',
]

const API_PEERS = '/api/peers'
const API_BALANCE = '/api/accounts/getBalance'

class peer {
  constructor($rootScope, $timeout, $http, $mdDialog, $q) {
    this.$rootScope = $rootScope
    this.$timeout = $timeout
    this.$http = $http
    this.$mdDialog = $mdDialog
    this.$q = $q
  }

  http (config) {
    config.url = path.join(config.endpoint, config.api)

    return this.$http(config)
  }

  request (method, endpoint, api, params) {
    return this.http({
      endpoint,
      api,
      method,
      params,
      timeout: 3000
    })
  }

  get (url, params) {
    return this.request('get', this.endpoint, url, params)
  }

  post (url, params) {
    return this.request('post', this.endpoint, url, params)
  }

  random () {
    return peers[parseInt(Math.random() * peers.length)]
  }

  session () {
    this.endpoint = this.random()
  }

  error () {
    this.$rootScope.$broadcast('logout')
  }

  getBalance (address, cb) {
    this.get(API_BALANCE, { address })
      .then(res => cb(res.data.balance))
      .catch(this.error.bind(this))
  }

  update () {
    let endpoint = this.random()

    this.get(endpoint, API_PEERS, { state: 2 }).then(
      (res) => {
        peers = res.data.peers.map(obj => `http://${obj.ip}:${obj.port}`)

        dbg('update peers from %s', endpoint)
        this.$timeout(this.update.bind(this), 60000)
      },
      (res) => {
        dbg('update error')
        this.$timeout(this.update.bind(this), 60000)
      }
    )
  }
}

app.service('peer', peer)

app.config($httpProvider => {
  $httpProvider.interceptors.push(($q, $injector) => {
    return {
      responseError: (rej) => {
        let peer = $injector.get('peer')
        let $http = $injector.get('$http')

        peer.session()
        rej.config.endpoint = peer.endpoint

        if (typeof rej.config.counter == 'undefined') {
          rej.config.counter = 0
        }

        rej.config.counter++

        if (rej.config.counter > 2) {
          return $q.reject(rej)
        }

        dbg('trying %s %s', peer.endpoint, rej.config.counter)

        return peer.http(rej.config)
      }
    }
  })
})
