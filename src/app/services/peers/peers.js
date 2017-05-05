import lisk from 'lisk-js';

const UPDATE_INTERVAL_CHECK = 10000;

app.factory('$peers', ($timeout, $cookies, $location, $q, $rootScope) => {
  class $peers {
    constructor() {
      this.check();

      $rootScope.$on('onAccountChange', (event, account) => {
        this.setActive(account);
      });
    }

    reset(active) {
      $timeout.cancel(this.timeout);

      if (active) {
        this.active = undefined;
      }
    }

    setActive(account) {
      let conf = { };
      const network = account.network;
      if (network) {
        conf = network;
        if (network.address) {
          conf.node = network.address.split(':')[1].replace('//', '');
          conf.port = network.address.match(/:([0-9]{1,5})$/)[1];
          conf.ssl = network.address.split(':')[0] === 'https';
        }
        if (conf.testnet === undefined && conf.port !== undefined) {
          conf.testnet = conf.port === '7000';
        }
      }

      this.active = lisk.api(conf);
      this.check();
    }

    sendRequestPromise(api, urlParams) {
      const deferred = $q.defer();
      this.active.sendRequest(api, urlParams, (data) => {
        if (data.success) {
          return deferred.resolve(data);
        }
        return deferred.reject(data);
      });
      return deferred.promise;
    }

    getStatusPromise() {
      return this.sendRequestPromise('loader/status', {});
    }

    check() {
      this.reset();

      const next = () => this.timeout = $timeout(this.check.bind(this), UPDATE_INTERVAL_CHECK);

      if (!this.active) {
        next();
        return;
      }

      this.getStatusPromise()
        .then(() => this.online = true)
        .catch(() => this.online = false)
        .finally(() => next());
    }
  }

  return new $peers();
});
