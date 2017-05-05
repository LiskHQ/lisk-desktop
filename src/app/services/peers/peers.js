import lisk from 'lisk-js';

const UPDATE_INTERVAL_CHECK = 10000;

app.factory('$peers', ($timeout, $cookies, $location, $q, $rootScope, Account) => {
  class $peers {
    constructor() {
      this.check();

      $rootScope.$on('onAccountChange', () => {
        this.setActive();
      });
    }

    reset(active) {
      $timeout.cancel(this.timeout);

      if (active) {
        this.active = undefined;
      }
    }

    setActive() {
      let conf = { };
      const network = Account.get().network;
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

      this.setPeerAPIObject(conf);
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

    listTransactions(address, limit, offset) {
      return this.sendRequestPromise('transactions', {
        senderId: address,
        recipientId: address,
        limit: limit || 20,
        offset: offset || 0,
      });
    }

    setPeerAPIObject(config) {
      this.active = lisk.api(config);

      this.active.getStatusPromise = () => this.sendRequestPromise('loader/status', {});

      this.active.getAccountPromise = (address) => {
        const deferred = $q.defer();
        this.active.getAccount(address, (data) => {
          if (data.success) {
            deferred.resolve(data.account);
          } else {
            deferred.resolve({
              address,
              balance: 0,
            });
          }
        });
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

      this.active.setSignature = (secondSecret, publicKey, secret) => {
        const deferred = $q.defer();
        this.active.sendRequest('signatures', { secondSecret, publicKey, secret }, (res) => {
          if (res.success) {
            deferred.resolve(res);
          }
          deferred.reject(res);
        });
        return deferred.promise;
      };
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
