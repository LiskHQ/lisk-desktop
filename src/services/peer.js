
import app from '../app'

const API_PEERS = '/api/peers'
const API_BALANCE = '/api/accounts/getBalance'
const API_HISTORY = '/api/transactions'

const REQUEST_TIMEOUT = 5000

app.factory('peer', ($http, $log, $q) => {
  return class peer {
    constructor ({ host, port, ssl = false }) {
      this.host = host
      this.port = port
      this.ssl = !!ssl
    }

    get uri () {
      return `${this.host}` + (this.port ? `:${this.port}` : '')
    }

    get url () {
      return (this.ssl ? 'https' : 'http') + `://${this.host}` + (this.port ? `:${this.port}` : '')
    }

    request (method, api, params) {
      let url = this.url + api

      return $http({ url, method, params, timeout: REQUEST_TIMEOUT })
        .then(
          (res) => {
            let success = !!res.data.success

            if (!success) {
              return $q.reject()
            }

            $log.debug('%s %s %s%s', method.toUpperCase(), res.status, this.url, api)
            return res
          },
          (res) => {
            $log.error('%s %s %s %s %s', method.toUpperCase(), this.url, api, res.status(params))
            return $q.reject()
          }
        )
    }

    get (api, data) {
      return this.request('get', api, data)
    }

    post (api, data) {
      return this.request('post', api, data)
    }

    getPeers () {
      let data = {
        state: 2
      }

      return this.get(API_PEERS, data)
        .then(res => res.data.peers)
        .then(res => {
          $log.info('getPeers: %s', res.length)
          return res
        })
    }

    getBalance (address) {
      let data = {
        address
      }

      return this.get(API_BALANCE, data)
        .then(res => res.data.balance)
        .then(res => {
          $log.info('getBalance %s: %s', address, res)
          return res
        })
    }

    getHistory (address, limit = 10, orderBy = 't_timestamp:desc') {
      let data = {
        senderId: address,
        recipientId: address,
        limit,
        orderBy
      }

      return this.get(API_HISTORY, data)
        .then(res => res.data.transactions)
        .then(res => {
          $log.info('getHistory %s: %s', address, res.length)
          return res
        })
    }
  }
})
