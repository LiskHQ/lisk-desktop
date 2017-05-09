import moment from 'moment';

app.factory('forgingService', ($peers, Account) => ({
  getDelegate() {
    return $peers.sendRequestPromise('delegates/get', {
      publicKey: Account.get().publicKey,
    });
  },

  getForgedBlocks(limit = 10, offset = 0) {
    return $peers.sendRequestPromise('blocks', {
      limit,
      offset,
      generatorPublicKey: Account.get().publicKey,
    });
  },

  getForgedStats(startMoment) {
    return $peers.sendRequestPromise('delegates/forging/getForgedByAccount', {
      generatorPublicKey: Account.get().publicKey,
      start: moment(startMoment).unix(),
      end: moment().unix(),
    });
  },
}));

