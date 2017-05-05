import lisk from 'lisk-js';

app.factory('Account', function ($rootScope, $peers, $q) {
  this.account = {};

  const merge = (obj) => {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      this.account[key] = obj[key];

      if (key === 'passphrase') {
        const kp = lisk.crypto.getKeys(obj[key]);
        this.account.publicKey = kp.publicKey;
        this.account.address = lisk.crypto.getAddress(kp.publicKey);
      }

      // Calling listeners with the list of changes
      $rootScope.$broadcast('onAccountChange', this.account);
    });
  };

  this.set = (config) => {
    merge(config);
    return this.account;
  };

  this.get = () => this.account;

  this.reset = () => {
    const keys = Object.keys(this.account);
    keys.forEach((key) => {
      delete this.account[key];
    });
  };

  this.getAccountPromise = (address) => {
    const deferred = $q.defer();
    $peers.active.getAccount(this.account.address, (data) => {
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

  this.sendLSK = (recipientId, amount, secret, secondSecret) => $peers.sendRequestPromise(
    'transactions', { recipientId, amount, secret, secondSecret });

  this.listTransactions = (address, limit = 20, offset = 0) => $peers.sendRequestPromise('transactions', {
    senderId: address,
    recipientId: address,
    limit,
    offset,
  });

  this.setSecondSecret = (secondSecret, publicKey, secret) => $peers.sendRequestPromise(
    'signatures', { secondSecret, publicKey, secret });

  return this;
});
