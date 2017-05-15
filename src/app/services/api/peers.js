import lisk from 'lisk-js';

app.factory('Peers', ($timeout, $cookies, $location, $q, $rootScope) => {
  class Peers {
    constructor() {
      $rootScope.$on('syncTick', () => {
        if (this.active) this.check();
      });
    }

    reset(active) {
      if (active) {
        this.active = undefined;
      }
    }

    setActive(network) {
      let conf = { };
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

    getStatus() {
      return this.sendRequestPromise('loader/status', {});
    }

    check() {
      this.reset();

      this.getStatus()
        .then(() => this.online = true)
        .catch(() => this.online = false);
    }
  }

  return new Peers();
});
