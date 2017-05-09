app.factory('delegateService', $peers => ({
  listAccountDelegates(options) {
    return $peers.sendRequestPromise('accounts/delegates', options);
  },

  listDelegates(options) {
    return $peers.sendRequestPromise(`delegates/${options.q ? 'search' : ''}`, options);
  },

  getDelegate(options) {
    return $peers.sendRequestPromise('delegates/get', options);
  },

  vote(options) {
    return $peers.sendRequestPromise('accounts/delegates', {
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
    return $peers.sendRequestPromise('delegates', data);
  },
}));

