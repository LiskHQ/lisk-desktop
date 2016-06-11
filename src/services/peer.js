
import app from '../app'

const API_BALANCE = '/api/accounts/getBalance'
const REQUEST_TIMEOUT = 5000

app.factory('peer', ($http, $log, $q) => {
  return class peer {
    constructor ({ host, port, https }) {
      this.host = host
      this.port = port
      this.https = !!https
    }

    get uri () {
      return `${this.host}` + (this.port ? `:${this.port}` : '')
    }

    get url () {
      return (this.https ? 'https' : 'http') + `://${this.host}` + (this.port ? `:${this.port}` : '')
    }

    request (method, api, params) {
      let url = this.url + api

      return $http({ url, method, params, timeout: REQUEST_TIMEOUT })
        .then(
          (res) => {
            $log.debug('%s %s%s %s', method, this.url, api, res.status)
            return res
          },
          (res) => {
            $log.error('%s %s%s %s', method, this.url, api, res.status)
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

    getBalance (address) {
      return this.get(API_BALANCE, { address })
        .then(res => {
          return res.data.balance
        })
    }
  }
})
