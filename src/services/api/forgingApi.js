import moment from 'moment';

/**
 * This factory provides methods for requesting the information of
 * the blocks forged by the account. it's using Account factory to access to account
 * publicKey and address and it's only used for accounts registered as delegate.
 *
 * @module app
 * @submodule forgingApi
 */
app.factory('forgingApi', (Peers, Account) => ({
  /**
   * Fetches the list of the delegates
   *
   * @returns {promise} Api call promise
   */
  getDelegate() {
    return Peers.sendRequestPromise('delegates/get', {
      publicKey: Account.get().publicKey,
    });
  },

  /**
   * fetches the list of forged blocks for the current account
   *
   * @param {Number} [limit=10] The maximum number of delegates
   * @param {Number} [offset=0] The offset for pagination
   * @returns {promise} Api call promise
   */
  getForgedBlocks(limit = 10, offset = 0) {
    return Peers.sendRequestPromise('blocks', {
      limit,
      offset,
      generatorPublicKey: Account.get().publicKey,
    });
  },

  /**
   * Fetches the statistics of forged blocks from the given date-time
   *
   * @param {Object} startMoment The moment.js date object
   */
  getForgedStats(startMoment) {
    return Peers.sendRequestPromise('delegates/forging/getForgedByAccount', {
      generatorPublicKey: Account.get().publicKey,
      start: moment(startMoment).unix(),
      end: moment().unix(),
    });
  },
}));

