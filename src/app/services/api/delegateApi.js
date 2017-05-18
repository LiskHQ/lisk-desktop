/**
 * This factory provides methods for requesting and updating the informations related
 * to the current client. it's using Account factory to access to account
 * publicKey and address and it's only used for accounts registered as delegate.
 *
 * @module app
 * @submodule delegateService
 */
app.factory('delegateService', Peers => ({
  /**
   * gets the list of delegtes for whom the given address has been voted
   * 
   * @param {object|string} address - The client address in string or in {address} format
   * @returns {promise} Api call promise
   */
  listAccountDelegates(address) {
    return Peers.sendRequestPromise('accounts/delegates', address);
  },

  listDelegates(options) {
    return Peers.sendRequestPromise(`delegates/${options.q ? 'search' : ''}`, options);
  },

  getDelegate(options) {
    return Peers.sendRequestPromise('delegates/get', options);
  },

  /**
   * (un)votes delegates based on voteList and unvoteList. 
   * The lists of the delegates contain plain addresses (without +-)
   * 
   * @param {String} secret  - Account primary passphrase
   * @param {String} publicKey  - Account publicKey
   * @param {array} voteList - The list of the delegates for whom we're voting
   * @param {array} unvoteList  - The list of the delegates from whom we're removing our votes
   * @param {String} [secondSecret=null] 
   * @returns {promise} Api call promise
   */
  vote(secret, publicKey, voteList, unvoteList, secondSecret = null) {
    return Peers.sendRequestPromise('accounts/delegates', {
      secret,
      publicKey,
      delegates: voteList.map(delegate => `+${delegate.publicKey}`).concat(
        unvoteList.map(delegate => `-${delegate.publicKey}`),
      ),
      secondSecret,
    });
  },

  /**
   * Searches between delegates with the given username, then filters the voteDic
   * from the results and only shows the delegated for which we haven't voted.
   * 
   * @param {String} username - username to search for
   * @param {Object} votedDict - The deligate list to filter from the results
   * @returns {array} The list of delegates whose username starts with the given username
   */
  voteAutocomplete(username, votedDict) {
    return this.listDelegates({ q: username }).then(
      response => response.delegates.filter(d => !votedDict[d.username]),
    );
  },

  /**
   * Filters the list of voted delegates with the given username
   * 
   * @param {String} username  - username to search for
   * @param {array} votedList - The list of the delegates for which we have voted
   * @returns  {array} The list of delegates whose username starts with the given username
   */
  unvoteAutocomplete(username, votedList) {
    return votedList.filter(delegate => delegate.username.indexOf(username) !== -1);
  },

  /**
   * Uses Peers service to register the client as delegate.
   * 
   * @param {String} username 
   * @param {String} secret - Account primary passphrase
   * @param {String} [secondSecret = null] - The second passphase of the account (if enabled).
   * @returns {promise} Api call promise
   */
  registerDelegate(username, secret, secondSecret = null) {
    const data = { username, secret };
    if (secondSecret) {
      data.secondSecret = secondSecret;
    }
    return Peers.sendRequestPromise('delegates', data);
  },
}));

