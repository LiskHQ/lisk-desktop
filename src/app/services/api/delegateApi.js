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

  vote(options) {
    return Peers.sendRequestPromise('accounts/delegates', {
      secret: options.secret,
      publicKey: options.publicKey,
      secondSecret: options.secondSecret,
      delegates: options.voteList.map(delegate => `+${delegate.publicKey}`).concat(
        options.unvoteList.map(delegate => `-${delegate.publicKey}`),
      ),
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

