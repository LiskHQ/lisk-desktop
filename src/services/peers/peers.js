
import _ from 'lodash'

import './peer'

import app from '../../app'

app.factory('$peers', ($peer) => {
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

    setActive () {
      this.active = _.chain([])
        .concat(this.stack.official, this.stack.public)
        .filter('enabled')
        .sample()
        .value()
    }

    add (data) {
      this.stack.public.push(new $peer(data))
    }
  }

  return new $peers()
})
