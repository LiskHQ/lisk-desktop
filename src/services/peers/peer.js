
import app from '../../app'

import lisk from 'lisk-js'

const API_PEERS = '/api/peers'
const API_ACCOUNT = '/api/accounts'
const API_BALANCE = '/api/accounts/getBalance'
const API_TRANSACTIONS = '/api/transactions'
const API_NETHASH = '/api/blocks/getNetHash'
const API_SEND_TRANSACTION = '/peer/transactions'

const REQUEST_TIMEOUT = 5000

const TRANSACTION_HEADER_OS = 'nanowallet'
const TRANSACTION_HEADER_PORT = '8000'
const TRANSACTION_HEADER_VERSION = '0.0.0'

app.factory('$peer', ($http, $log, $q) => {
  return class $peer {
    constructor ({ host, port = 8000, ssl = false }) {
      this.host = host
      this.port = port
      this.ssl = !!ssl
    }

    get uri () {
      return `${this.host}` + (this.port ? `:${this.port}` : '')
    }

    get url () {
      return (this.ssl ? 'https' : 'http') + `://${this.uri}`
    }

    request (method, api, data, headers) {
      let url = this.url + api

      let config = {
        url,
        method,
        headers,
        timeout: REQUEST_TIMEOUT,
      }

      if (method === 'post') {
        config.data = data
      } else {
        config.params = data
      }

      return $http(config)
        .then(res => {
          $log.info(`${method} ${url}`)
          return res
        })
        .then(res => {
          if (!res.data.success) {
            return $q.reject({ message: res.data.message || res.data.error || null })
          } else {
            return res
          }
        })
    }

    get (api, data, headers) {
      return this.request('get', api, data, headers)
    }

    post (api, data, headers) {
      return this.request('post', api, data, headers)
    }

    getPeers () {
      let data = {
        state: 2,
      }

      return this.get(API_PEERS, data)
        .then(res => res.data.peers)
    }

    getAccount (address) {
      return this.get(API_ACCOUNT, { address })
        .then(res => res.data.account)
        .catch(res => {
          return this.getBalance(address)
            .then(balance => {
              return {
                address,
                balance,
              }
            })
        })
    }

    getBalance (address) {
      let data = {
        address,
      }

      return this.get(API_BALANCE, data)
        .then(res => res.data.balance)
    }

    getTransactions (address, limit = 100, orderBy = 't_timestamp:desc') {
      let data = {
        senderId: address,
        recipientId: address,
        limit,
        orderBy
      }

      return this.get(API_TRANSACTIONS, data)
        .then(res => res.data)
    }

    getNetHash () {
      return this.get(API_NETHASH)
        .then(res => res.data.nethash)
    }

    sendTransaction (passphrase, secondPassphrase, recipient, amount) {
      let transaction

      amount = parseInt(amount * Math.pow(10, 8))

      try {
        transaction = lisk.transaction.createTransaction(
          recipient,
          amount,
          passphrase,
          secondPassphrase
        )
      } catch (e) {
        return $q.reject()
      }

      return this.getNetHash()
        .then(nethash => {
          let headers = {
            nethash,
            os: TRANSACTION_HEADER_OS,
            version: TRANSACTION_HEADER_VERSION,
            port: TRANSACTION_HEADER_PORT,
          }

          return this.post(API_SEND_TRANSACTION, { transaction }, headers)
        })
    }
  }
})
