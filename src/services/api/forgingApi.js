import moment from 'moment';

app.factory('forgingService', (Peers, Account) => ({
  getDelegate() {
    return Peers.sendRequestPromise('delegates/get', {
      publicKey: Account.get().publicKey,
    });
  },

  getForgedBlocks(limit = 10, offset = 0) {
    return Peers.sendRequestPromise('blocks', {
      limit,
      offset,
      generatorPublicKey: Account.get().publicKey,
    });
  },

  getForgedStats(startMoment) {
    return Peers.sendRequestPromise('delegates/forging/getForgedByAccount', {
      generatorPublicKey: Account.get().publicKey,
      start: moment(startMoment).unix(),
      end: moment().unix(),
    });
  },
}));

