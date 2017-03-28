import lisk from 'lisk-js';

const UPDATE_INTERVAL_CHECK = 10000;

app.factory('$peers', ($timeout, $cookies, $location, $q) => {
  class $peers {
    constructor() {
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
        conf.testnet = true;
        conf.nethash = '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d';
      } else if (peerStack === 'testnet') {
        conf.testnet = true;
      }
      this.active = lisk.api(conf);
      this.stack = this.active.listPeers();

      this.active.getStatusPromise = () => {
        const deferred = $q.defer();
        this.active.sendRequest('loader/status', {}, (data) => {
          if (data.success) {
            return deferred.resolve();
          }
          return deferred.reject();
        });
        return deferred.promise;
      };

      this.active.getAccountPromise = (address) => {
        const deferred = $q.defer();
        this.active.getAccount(address, data => deferred.resolve(data.account));
        return deferred.promise;
      };

      this.active.sendLSKPromise = (recipient, amount, passphrase, secondPassphrase) => {
        const deferred = $q.defer();
        this.active.sendLSK(recipient, amount, passphrase, secondPassphrase, (data) => {
          if (data.success) {
            return deferred.resolve(data);
          }
          return deferred.reject(data);
        });
        return deferred.promise;
      };

      this.active.listTransactionsPromise = (address, limit, offset) => {
        const deferred = $q.defer();
        this.active.listTransactions(address, limit, offset, (data) => {
          if (data.success) {
            return deferred.resolve(data);
          }
          return deferred.reject(data);
        });
        return deferred.promise;
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

      this.active.getStatusPromise()
        .then(() => this.online = true)
        .catch(() => this.online = false)
        .finally(() => next());
    }
  }

  return new $peers();
});
