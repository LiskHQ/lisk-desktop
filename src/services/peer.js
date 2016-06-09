
import debug from 'debug'

import app from '../app'

let dbg = debug('app:peer')

let peers = {
  official: [
    'https://login.lisk.io',
    'https://login01.lisk.io',
    'https://login02.lisk.io',
    'https://login03.lisk.io',
    'https://login04.lisk.io',
    'https://login05.lisk.io',
    'https://login06.lisk.io',
    'https://login08.lisk.io',
  ],
  public: []
}

const API_PEERS = '/api/peers?state=2'
const API_BALANCE = '/api/accounts/getBalance'

class peer {
  constructor($timeout, $http, $mdDialog) {
    this.$timeout = $timeout
    this.$http = $http
    this.$mdDialog = $mdDialog

    // this.updatePeers()
  }

  onError () {
    // TODO
    // this.$mdDialog.show(
    //   this.$mdDialog.alert()
    // )
  }

  get (endpoint, path) {
    if (!path) {
      path = endpoint
      endpoint = this.public
    }

    dbg(`${endpoint}${path}`)

    return this.$http.get(`${endpoint}${path}`)
  }

  updatePeers () {
    let endpoint = this.official

    this.get(endpoint, API_PEERS).then(
      (res) => {
        peers.public = res.data.peers.map(obj => `http://${obj.ip}:${obj.port}`)

        dbg('update peers from %s', endpoint)
        this.$timeout(this.updatePeers.bind(this), 60000)
      },
      (res) => {
        dbg('update error')
        this.$timeout(this.updatePeers.bind(this), 60000)
      }
    )
  }

  random () {
    let list = peers.public.length ? peers.public : peers.official
    return this._public = list[parseInt(Math.random() * list.length)]
  }

  getBalance (address, cb) {
    this.get(`${API_BALANCE}?address=${address}`).then((res) => {
      cb(res.data.balance)
    })
  }

  get official () {
    return peers.official[parseInt(Math.random() * peers.official.length)]
  }

  get public () {
    return this._public
  }
}

app.service('peer', peer)
