
import _ from 'lodash'

import app from '../app'

const UPDATE_INTERVAL = 60000

app.factory('$peers', ($log, $q, $timeout, $peer, $interval) => {
  class $peers {
    constructor () {
      this.stack = {
        official: [
          new $peer({ host: 'node01.lisk.io' }),
          new $peer({ host: 'node02.lisk.io' }),
          new $peer({ host: 'node03.lisk.io' }),
          new $peer({ host: 'node04.lisk.io' }),
          new $peer({ host: 'node05.lisk.io' }),
          new $peer({ host: 'node06.lisk.io' }),
          new $peer({ host: 'node07.lisk.io' }),
          new $peer({ host: 'node08.lisk.io' }),
        ],
        public: [],
        testnet: [
          new $peer({ host: 'testnet.lisk.io', port: null, ssl: true }),
        ]
      }
    }

    random (type) {
      let stack = _.concat(this.stack.official, this.stack.public)
      return stack[parseInt(Math.random() * stack.length)]
    }

    add (data) {
      this.stack.public.push(new $peer(data))
    }
  }

  return new $peers()
})
