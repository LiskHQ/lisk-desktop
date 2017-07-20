/**
 * This factory provides methods for requesting the information of
 * the current account. it's using Account factory to access account
 * publicKey and address
 *
 * @module app
 * @submodule AccountApi
 */
app.factory('AccountApi', function ($q, Peers, Account) {
  /**
   * Uses Peers service to fetch the account stats for a given address.
   *
   * @param {String} address - the address(wallet Id) of the account.
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
   * @param {Number} [timestamp = 10] - The time offset to compensate time setting issues
   */
  this.setSecondSecret = (secondSecret, publicKey,
    secret, timestamp = 10) => Peers.sendRequestPromise(
    'signatures', { secondSecret, publicKey, secret, timestamp });

  this.transactions = {};

  /**
   * Uses Peers service to send a given amount of LSK to a given account
   *
   * @param {String} recipientId - The address(wallet Id) of the recipient
   * @param {Number} amount - A floating point value in LSK
   * @param {String} secret - account's primary passphrase
   * @param {String} [secondSecret = null] - The second passphrase of the account (if enabled).
   * @param {Number} [timestamp = 10] - The time offset to compensate time setting issues
   */
  this.transactions.create = (recipientId, amount, secret,
    secondSecret = null, timestamp = 10) => Peers.sendRequestPromise('transactions',
      { recipientId, amount, secret, secondSecret, timestamp });

  /**
   * Uses Peers service to get the list of transactions for a specific address
   *
   * @param {String} address - The address of the account to get transactions list for
   * @param {Number} [limit = 20] - The maximum number of items in list
   * @param {Number} [offset = 0] - The offset index
   * @param {String} [orderBy = 'timestamp:desc'] - How is the list ordered
   */
  this.transactions.get = (address, limit = 20, offset = 0, orderBy = 'timestamp:desc') => Peers.sendRequestPromise('transactions', {
    senderId: address,
    recipientId: address,
    limit,
    offset,
    orderBy,
  });

  return this;
});
