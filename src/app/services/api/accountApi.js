/**
 * This factory provides methods for requesting the informations related
 * to the current client. it's using Account factory to access to account
 * publicKey and address
 *
 * @module app
 * @submodule AccountApi
 */
app.factory('AccountApi', function ($q, Peers, Account) {
  /**
   * Uses Peers service to fetch the account stats for a given address.
   *
   * @param {String} address - the address(wallet Id) of the client.
   * @returns {promise} Api call promise
   */
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

  /**
   * Uses Peers service to set second passphrase for a given account
   *
   * @param {String} secondSecret - Chosen passphrase
   * @param {String} publicKey - Account publicKey
   * @param {String} secret - Account primary passphrase
   * @returns {promise} Api call promise
   */
  this.setSecondSecret = (secondSecret, publicKey, secret) => Peers.sendRequestPromise(
    'signatures', { secondSecret, publicKey, secret });

  this.transactions = {};

  /**
   * Uses Peers service to transfer a given amount of LSK to a given account
   *
   * @param {String} recipientId - The address(wallet Id) of the recipient
   * @param {Number} amount - A floating point value in LSK
   * @param {String} secret - client's primary passphrase
   * @param {String} [secondSecret = null] - The second passphase of the account (if enabled).
   */
  this.transactions.create = (recipientId, amount, secret,
    secondSecret = null) => Peers.sendRequestPromise('transactions',
      { recipientId, amount, secret, secondSecret });

  /**
   * Uses Peers service to get the list of transactions for a specific address
   *
   * @param {String} address - The address of the account to get transactions list for
   * @param {Number} [limit = 20] - The maximum number of items in list
   * @param {Number} [offset = 0] - The offset index
   */
  this.transactions.get = (address, limit = 20, offset = 0) => Peers.sendRequestPromise('transactions', {
    senderId: address,
    recipientId: address,
    limit,
    offset,
  });

  return this;
});
