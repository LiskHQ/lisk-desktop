app.factory('delegateService', Peers => ({
  listAccountDelegates(options) {
    return Peers.sendRequestPromise('accounts/delegates', options);
  },

  listDelegates(options) {
    return Peers.sendRequestPromise(`delegates/${options.q ? 'search' : ''}`, options);
  },

  getDelegate(options) {
    return Peers.sendRequestPromise('delegates/get', options);
  },

  vote({secret, publicKey, voteList, unvoteList, secondSecret = null}) {
    return Peers.sendRequestPromise('accounts/delegates', {
      secret: secret,
      publicKey: publicKey,
      delegates: voteList.map(delegate => `+${delegate.publicKey}`).concat(
        unvoteList.map(delegate => `-${delegate.publicKey}`),
      ),
      secondSecret: secondSecret,
    });
  },

  voteAutocomplete(username, votedDict) {
    return this.listDelegates({ q: username }).then(
      response => response.delegates.filter(d => !votedDict[d.username]),
    );
  },

  unvoteAutocomplete(username, votedList) {
    return votedList.filter(delegate => delegate.username.indexOf(username) !== -1);
  },

  registerDelegate(username, secret, secondSecret) {
    const data = { username, secret };
    if (secondSecret) {
      data.secondSecret = secondSecret;
    }
    return Peers.sendRequestPromise('delegates', data);
  },
}));

