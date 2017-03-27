import lisk from 'lisk-js';

import './peer';

const UPDATE_INTERVAL_CHECK = 10000;

app.factory('$peers', ($peer, $timeout, $cookies, $location, $q) => {
  class $peers {
    constructor() {
      this.stack = {
        official: [],
        public: [],
        testnet: [],
        localhost: [
          new $peer({ host: 'localhost:4000', port: null, ssl: false }),
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
      const peerStack = $location.search().peerStack || $cookies.get('peerStack') || 'official';
      const conf = { };
      if (peerStack === 'localhost') {
        conf.node = 'localhost';
        conf.port = 4000;
      } else if (peerStack === 'testnet') {
        conf.testnet = true;
      }
      this.active = lisk.api(conf);
      this.stack = this.active.listPeers();
      this.stack.localhost = [this.stack.localhost];
      this.active.legacyPeer = new $peer({ host: this.active.currentPeer, port: this.active.port });
      this.active.status = () => this.active.legacyPeer.status();

      this.active.getAccountPromise = (address) => {
        const deferred = $q.defer();
        this.active.getAccount(address, data => deferred.resolve(data.account));
        return deferred.promise;
      };

      this.active.listTransactionsPromise = (address, limit, offset) => {
        const deferred = $q.defer();
        this.active.listTransactions(address, `${limit}`, offset, data => deferred.resolve(data.data));
        return deferred.promise;
      };

      // eslint-disable-next-line arrow-body-style
      this.active.getTransactions = (address, limit) => {
        return this.active.legacyPeer.getTransactions(address, limit);
      };

      this.check();
    }

    check() {
      this.reset();

      const next = () => this.timeout = $timeout(this.check.bind(this), UPDATE_INTERVAL_CHECK);

      if (!this.active) {
        next();
        return;
      }

      this.active.status()
        .then(() => this.online = true)
        .catch(() => this.online = false)
        .finally(() => next());
    }
  }

  return new $peers();
});
