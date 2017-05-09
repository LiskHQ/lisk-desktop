app.factory('AccountApi', function ($rootScope, $peers, $q, Account) {
  this.get = (address) => {
    const deferred = $q.defer();
    $peers.active.getAccount(Account.get().address, (data) => {
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

  this.setSecondSecret = (secondSecret, publicKey, secret) => $peers.sendRequestPromise(
    'signatures', { secondSecret, publicKey, secret });

  this.transactions = {};

  this.transactions.create = (recipientId, amount, secret, secondSecret) => $peers.sendRequestPromise(
    'transactions', { recipientId, amount, secret, secondSecret });

  this.transactions.get = (address, limit = 20, offset = 0) => $peers.sendRequestPromise('transactions', {
    senderId: address,
    recipientId: address,
    limit,
    offset,
  });

  return this;
});



