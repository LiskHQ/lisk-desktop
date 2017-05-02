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

    setActive(peerConf) {
      const peerStack = $location.search().peerStack || $cookies.get('peerStack') || 'official';
      let conf = peerConf || { };
      const localhostConf = {
        node: 'localhost',
        port: 4000,
        testnet: true,
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      };
      if (peerStack === 'localhost' && !peerConf) {
        conf = localhostConf;
      } else if (peerStack === 'testnet' && !peerConf) {
        conf.testnet = true;
      }

      this.setPeerAPIObject(conf);
      if (!this.stack) {
        this.stack = this.active.listPeers();
        this.stack.localhost = [localhostConf, {
          node: 'localhost',
          port: 7000,
          testnet: true,
        }, {
          node: 'localhost',
          port: 8000,
        }];
        this.peerByName = {};
        Object.keys(this.stack).forEach((key) => {
          this.stack[key].forEach(peer => this.peerByName[peer.node + (peer.port || '')] = peer);
        });
      }
      this.currentPeerConfig = this.peerByName[this.active.currentPeer + this.active.port] ||
        this.peerByName[this.active.currentPeer];

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

      this.active.registerDelegate = (username, secret, secondSecret) => {
        const data = { username, secret };
        if (secondSecret) {
          data.secondSecret = secondSecret;
        }
        const deferred = $q.defer();
        this.active.sendRequest('delegates', data, (res) => {
          if (res.success) {
            deferred.resolve(res);
          } else {
            deferred.reject(res);
          }
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
