
import _ from 'lodash';

import './peer';

const UPDATE_INTERVAL_CHECK = 10000;

app.factory('$peers', ($peer, $timeout, $cookies) => {
  class $peers {
    constructor() {
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
        ],
      };

      this.check();
    }

    reset(active) {
      $timeout.cancel(this.timeout);

      if (active) {
        this.active = undefined;
      }
    }

    setActive() {
      this.active = _.chain([])
        .concat($cookies.get('peerStack') == 'testnet' ?
          this.stack.testnet : this.stack.official,
          this.stack.public)
        .sample()
        .value();

      this.check();
    }

    check() {
      this.reset();

      const next = () => this.timeout = $timeout(this.check.bind(this), UPDATE_INTERVAL_CHECK);

      if (!this.active) {
        return next();
      }

      this.active.status()
        .then(() => this.online = true)
        .catch(() => this.online = false)
        .finally(() => next());
    }
  }

  return new $peers();
});
