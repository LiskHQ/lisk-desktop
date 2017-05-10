app.factory('AccountApi', function ($q, Peers, Account) {
  this.get = (address) => {
    const deferred = $q.defer();
    Peers.active.getAccount(Account.get().address, (data) => {
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

  this.setSecondSecret = (secondSecret, publicKey, secret) => Peers.sendRequestPromise(
    'signatures', { secondSecret, publicKey, secret });

  this.transactions = {};

  this.transactions.create = (recipientId, amount, secret,
    secondSecret = null) => Peers.sendRequestPromise('transactions',
      { recipientId, amount, secret, secondSecret });

  this.transactions.get = (address, limit = 20, offset = 0) => Peers.sendRequestPromise('transactions', {
    senderId: address,
    recipientId: address,
    limit,
    offset,
  });

  return this;
});
